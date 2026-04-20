import { useState } from 'react';
import styles from './SignInPage.module.scss';

const API_URL = import.meta.env.VITE_API_URL;

// Handles the two-step password reset: enter email → enter code + new password.
export default function ForgotPasswordForm({ onBack }) {
    const [step, setStep] = useState('email'); // 'email' | 'reset'
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleEmailSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Something went wrong.');
                return;
            }
            setStep('reset');
        } catch {
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    }

    async function handleResetSubmit(e) {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, new_password: password })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Reset failed.');
                return;
            }
            setSuccess(true);
        } catch {
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className={styles.form_container}>
                <h1 className={styles.title}>Password Updated</h1>
                <p className={styles.subtitle}>Your password has been reset successfully.</p>
                <button className={styles.primary_button} onClick={onBack}>
                    Sign In
                </button>
            </div>
        );
    }

    if (step === 'email') {
        return (
            <div className={styles.form_container}>
                <h1 className={styles.title}>Forgot Password</h1>
                <p className={styles.subtitle}>Enter your email and we'll send you a reset code.</p>

                {error && <p className={styles.error}>{error}</p>}

                <form onSubmit={handleEmailSubmit} className={styles.form}>
                    <div className={styles.input_group}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.primary_button} disabled={loading}>
                        {loading ? 'Sending...' : 'Send Code'}
                    </button>
                </form>

                <p className={styles.signup_link}>
                    <button className={styles.link_button} onClick={onBack}>Back to Sign In</button>
                </p>
            </div>
        );
    }

    return (
        <div className={styles.form_container}>
            <h1 className={styles.title}>Reset Password</h1>
            <p className={styles.subtitle}>Enter the code we sent to {email} and your new password.</p>

            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleResetSubmit} className={styles.form}>
                <div className={styles.input_group}>
                    <label className={styles.label}>Reset Code</label>
                    <input
                        type="text"
                        value={code}
                        onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className={styles.input}
                        placeholder="000000"
                        maxLength={6}
                        required
                        autoFocus
                    />
                </div>
                <div className={styles.input_group}>
                    <label className={styles.label}>New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={styles.input}
                        placeholder="Min. 8 characters"
                        required
                    />
                </div>
                <div className={styles.input_group}>
                    <label className={styles.label}>Confirm Password</label>
                    <input
                        type="password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        className={styles.input}
                        placeholder="Repeat new password"
                        required
                    />
                </div>
                <button type="submit" className={styles.primary_button} disabled={loading || code.length < 6}>
                    {loading ? 'Saving...' : 'Reset Password'}
                </button>
            </form>

            <p className={styles.signup_link}>
                <button className={styles.link_button} onClick={() => setStep('email')}>Resend code</button>
            </p>
        </div>
    );
}
