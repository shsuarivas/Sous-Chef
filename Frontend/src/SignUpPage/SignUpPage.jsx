import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignUpPage.module.scss';
import HomeImage from '../DefaultHomePage/Images/Image.jsx';
import PageBar from '../DefaultHomePage/DefaultHomePageBar/DefaultHomePageBar.jsx';

const API_URL = import.meta.env.VITE_API_URL;

export default function SignUpPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        surname: '',
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Signup failed.');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/main');
        } catch (err) {
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        // Handle Google sign up logic here
        console.log('Google sign up');
    };

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
                    <div className={styles.form_container}>
                        <h1 className={styles.title}>Join Byte Your Fork</h1>
                        <p className={styles.subtitle}>Create your account to start your culinary journey</p>

                        {error && <p className={styles.error}>{error}</p>}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.input_group}>
                                <label htmlFor="first_name" className={styles.label}>First Name</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Enter your first name"
                                    required
                                />
                            </div>

                            <div className={styles.input_group}>
                                <label htmlFor="surname" className={styles.label}>Surname</label>
                                <input
                                    type="text"
                                    id="surname"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Enter your surname"
                                    required
                                />
                            </div>

                            <div className={styles.input_group}>
                                <label htmlFor="username" className={styles.label}>Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>

                            <div className={styles.input_group}>
                                <label htmlFor="email" className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Create a password (min. 8 characters)"
                                    required
                                />
                            </div>

                            <button type="submit" className={styles.primary_button} disabled={loading}>
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className={styles.divider}>
                            <span>or</span>
                        </div>

                        <button onClick={handleGoogleSignUp} className={styles.google_button}>
                            <svg className={styles.google_icon} viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>

                        <p className={styles.signup_link}>
                            Already have an account? <Link to="/signin">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
