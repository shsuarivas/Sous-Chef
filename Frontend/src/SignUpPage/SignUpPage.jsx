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

                        <p className={styles.signup_link}>
                            Already have an account? <Link to="/signin">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
