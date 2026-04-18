import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../db.js';
import { generateOTP, expiresInMinutes } from '../utils/tokens.js';
import { sendPasswordResetEmail, sendMFACodeEmail } from '../email.js';

const router = Router();
const SALT_ROUNDS = 12;

// POST /auth/signup
router.post('/signup', async (req, res) => {
    const { first_name, surname, username, email, password } = req.body;

    if (!first_name || !surname || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    try {
        const existing = await pool.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Email or username already in use.' });
        }

        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        const result = await pool.query(
            `INSERT INTO users (first_name, surname, username, email, password_hash)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, first_name, surname, username, email`,
            [first_name, surname, username, email, password_hash]
        );

        const user = result.rows[0];
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            // eslint-disable-next-line no-undef
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ token, user });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error during signup.' });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const result = await pool.query(
            'SELECT id, first_name, surname, username, email, password_hash FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const code = generateOTP();
        const expires_at = expiresInMinutes(10);

        await pool.query(
            'INSERT INTO mfa_codes (user_id, code, expires_at) VALUES ($1, $2, $3)',
            [user.id, code, expires_at]
        );

        await sendMFACodeEmail(user.email, code);

        res.json({ mfa_required: true, user_id: user.id });
    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ error: 'Server error during signin.' });
    }
});

router.post('/verify-mfa', async (req, res) => {
    const { user_id, code } = req.body;

    if (!user_id || !code) {
        return res.status(400).json({ error: 'user_id and code are required.' });
    }

    try {
        const result = await pool.query(
            `SELECT id FROM mfa_codes
             WHERE user_id = $1 AND code = $2 AND used = FALSE AND expires_at > NOW()
             ORDER BY id DESC LIMIT 1`,
            [user_id, code]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired code.' });
        }

        await pool.query('UPDATE mfa_codes SET used = TRUE WHERE id = $1', [result.rows[0].id]);

        const userResult = await pool.query(
            'SELECT id, first_name, surname, username, email FROM users WHERE id = $1',
            [user_id]
        );
        const user = userResult.rows[0];

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            // eslint-disable-next-line no-undef
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, user });
    } catch (err) {
        console.error('Verify MFA error:', err);
        res.status(500).json({ error: 'Server error during MFA verification.' });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.json({ message: 'If that email exists, a reset code has been sent.' });
        }

        const user = result.rows[0];
        const code = generateOTP();
        const expires_at = expiresInMinutes(30);

        await pool.query(
            'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [user.id, code, expires_at]
        );

        await sendPasswordResetEmail(email, code);

        res.json({ message: 'If that email exists, a reset code has been sent.' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

router.post('/reset-password', async (req, res) => {
    const { email, code, new_password } = req.body;

    if (!email || !code || !new_password) {
        return res.status(400).json({ error: 'Email, code, and new password are required.' });
    }
    if (new_password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    try {
        const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid code.' });
        }

        const user_id = userResult.rows[0].id;

        const tokenResult = await pool.query(
            `SELECT id FROM password_reset_tokens
             WHERE user_id = $1 AND token = $2 AND used = FALSE AND expires_at > NOW()
             ORDER BY id DESC LIMIT 1`,
            [user_id, code]
        );

        if (tokenResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired code.' });
        }

        const password_hash = await bcrypt.hash(new_password, SALT_ROUNDS);

        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, user_id]);
        await pool.query('UPDATE password_reset_tokens SET used = TRUE WHERE id = $1', [tokenResult.rows[0].id]);

        res.json({ message: 'Password updated successfully.' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

export default router;
