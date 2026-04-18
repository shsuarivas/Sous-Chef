import { useState } from 'react';
import styles from './SignInPage.module.scss';

const API_URL = import.meta.env.VITE_API_URL;

export default function MFAForm({ userId, onSuccess }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/verify-mfa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, code })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Verification failed.');
                return;
            }
            onSuccess(data.token, data.user);
        } catch {
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.form_container}>
            <h1 className={styles.title}>Check your email</h1>
            <p className={styles.subtitle}>
                We sent a 6-digit code to your email. Enter it below to sign in.
            </p>

            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.input_group}>
                    <label htmlFor="mfa_code" className={styles.label}>Verification Code</label>
                    <input
                        type="text"
                        id="mfa_code"
                        value={code}
                        onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className={styles.input}
                        placeholder="000000"
                        maxLength={6}
                        required
                        autoFocus
                    />
                </div>
                <button type="submit" className={styles.primary_button} disabled={loading || code.length < 6}>
                    {loading ? 'Verifying...' : 'Verify'}
                </button>
            </form>
        </div>
    );
}
