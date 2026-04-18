import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignInPage.module.scss';
import HomeImage from '../DefaultHomePage/Images/Image.jsx';
import PageBar from '../DefaultHomePage/DefaultHomePageBar/DefaultHomePageBar.jsx';
import MFAForm from './MFAForm.jsx';
import ForgotPasswordForm from './ForgotPasswordForm.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function CredentialsForm({ onMFARequired, onForgotPassword }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Sign in failed.');
                return;
            }
            if (data.mfa_required) {
                onMFARequired(data.user_id);
            }
        } catch {
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.form_container}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to your Byte Your Fork account</p>

            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.input_group}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className={styles.input_group}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className={styles.primary_button} disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p className={styles.signup_link}>
                <button className={styles.link_button} onClick={onForgotPassword}>
                    Forgot password?
                </button>
            </p>
            <p className={styles.signup_link}>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}


export default function SignInPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState('credentials'); 
    const [pendingUserId, setPendingUserId] = useState(null);

    function handleMFARequired(userId) {
        setPendingUserId(userId);
        setStep('mfa');
    }

    function handleMFASuccess(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/main');
    }

    return (
        <div className={styles.page_container}>
            <div className={styles.titlebar}>
                <PageBar />
            </div>
            <div className={styles.content_container}>
                <div className={styles.image_section}>
                    <div className={styles.image_overlay}>
                        <HomeImage />
                    </div>
                </div>
                <div className={styles.form_section}>
                    {step === 'credentials' && (
                        <CredentialsForm
                            onMFARequired={handleMFARequired}
                            onForgotPassword={() => setStep('forgot')}
                        />
                    )}
                    {step === 'mfa' && (
                        <MFAForm
                            userId={pendingUserId}
                            onSuccess={handleMFASuccess}
                        />
                    )}
                    {step === 'forgot' && (
                        <ForgotPasswordForm onBack={() => setStep('credentials')} />
                    )}
                </div>
            </div>
        </div>
    );
}
