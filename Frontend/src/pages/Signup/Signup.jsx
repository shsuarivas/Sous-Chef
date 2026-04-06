import styles from '../Shared.module.scss';
import Button from '../../components/Button/Button.jsx';
import { useNavigate, Link } from 'react-router-dom';
import mainImg from '../../assets/HomePageImage.png';
import logo from '../../assets/Sous_Chef_Logo.png';

export default function Signup() {
    const navigate = useNavigate();

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.imageHalf}>
                <div className={styles.overlay}></div>
                <img src={mainImg} alt="Kitchen Backdrop" />
            </div>

            <div className={styles.formHalf}>
                <div className={styles.authCard}>
                    <div className={styles.logoArea}>
                        <Link to="/"><img src={logo} alt="Logo" /></Link>
                    </div>

                    <h1 className={styles.title}>Join the Kitchen</h1>
                    <p className={styles.subtitle}>Create an account to start cooking like a pro.</p>
                    
                    <div className={styles.inputGroup}>
                        <div className={styles.inputWrapper}>
                            <label>Username</label>
                            <input className={styles.input} type="text" placeholder="RatChef99" />
                        </div>
                        <div className={styles.inputWrapper}>
                            <label>Email Address</label>
                            <input className={styles.input} type="email" placeholder="chef@example.com" />
                        </div>
                        <div className={styles.inputWrapper}>
                            <label>Password</label>
                            <input className={styles.input} type="password" placeholder="••••••••" />
                        </div>
                    </div>

                    <div className={styles.buttonRow} style={{ flexDirection: 'row' }}>
                        <Button variant="secondary" label="Go Back" onClick={() => navigate('/')} />
                        <Button variant="primary" label="Create Account" onClick={() => navigate('/main')} />
                    </div>

                    <div className={styles.divider}>
                        <span>or</span>
                    </div>

                    <button className={styles.googleButton} onClick={() => navigate('/main')}>
                        <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" />
                        Sign up with Google
                    </button>

                    <p className={styles.footerText}>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
