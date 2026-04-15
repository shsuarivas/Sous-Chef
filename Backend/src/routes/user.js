import { Router } from 'express';
import bcrypt from 'bcrypt';
import authenticate from '../middleware/authenticate.js';
import pool from '../../db.js';

const router = Router();

// All routes require a valid JWT
router.use(authenticate);

// PUT /user/username
router.put('/username', async (req, res) => {
    const { username } = req.body;

    if (!username || username.trim().length === 0) {
        return res.status(400).json({ error: 'Username is required.' });
    }

    try {
        const existing = await pool.query(
            'SELECT id FROM users WHERE username = $1 AND id != $2',
            [username, req.user.userId]
        );
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Username already taken.' });
        }

        const result = await pool.query(
            'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, first_name, surname, username, email',
            [username, req.user.userId]
        );

        res.json({ user: result.rows[0] });
    } catch (err) {
        console.error('Update username error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// PUT /user/email
router.put('/email', async (req, res) => {
    const { email } = req.body;

    if (!email || email.trim().length === 0) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        const existing = await pool.query(
            'SELECT id FROM users WHERE email = $1 AND id != $2',
            [email, req.user.userId]
        );
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Email already in use.' });
        }

        const result = await pool.query(
            'UPDATE users SET email = $1 WHERE id = $2 RETURNING id, first_name, surname, username, email',
            [email, req.user.userId]
        );

        res.json({ user: result.rows[0] });
    } catch (err) {
        console.error('Update email error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// PUT /user/password
router.put('/password', async (req, res) => {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
        return res.status(400).json({ error: 'Current and new password are required.' });
    }
    if (new_password.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    }

    try {
        const result = await pool.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [req.user.userId]
        );

        const match = await bcrypt.compare(current_password, result.rows[0].password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Current password is incorrect.' });
        }

        const password_hash = await bcrypt.hash(new_password, 12);
        await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [password_hash, req.user.userId]
        );

        res.json({ message: 'Password updated.' });
    } catch (err) {
        console.error('Update password error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

export default router;
