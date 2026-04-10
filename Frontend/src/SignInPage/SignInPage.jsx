import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SignInPage.module.scss';
import HomeImage from '../DefaultHomePage/Images/Image.jsx';
import PageBar from '../DefaultHomePage/DefaultHomePageBar/DefaultHomePageBar.jsx';

export default function SignInPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle sign in logic here
        console.log('Sign in:', formData);
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
                        <h1 className={styles.title}>Welcome Back</h1>
                        <p className={styles.subtitle}>Sign in to your Byte Your Fork account</p>

                        <form onSubmit={handleSubmit} className={styles.form}>
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
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <button type="submit" className={styles.primary_button}>
                                Sign In
                            </button>
                        </form>

                        <p className={styles.signup_link}>
                            Don't have an account? <Link to="/signup">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}