import styles from '../Shared.module.scss';
import Button from '../../components/Button/Button.jsx';
import { useNavigate, Link } from 'react-router-dom';
import mainImg from '../../assets/HomePageImage.png';
import logo from '../../assets/Sous_Chef_Logo.png';

export default function Login() {
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

                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Sign in to save and organize your recipes.</p>
                    
                    <div className={styles.inputGroup}>
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
                        <Button label="Go Back" onClick={() => navigate('/')} />
                        <Button label="Sign In" onClick={() => navigate('/main')} />
                    </div>

                    <div className={styles.divider}>
                        <span>or</span>
                    </div>

                    <button className={styles.googleButton} onClick={() => navigate('/main')}>
                        <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" />
                        Sign in with Google
                    </button>

                    <p className={styles.footerText}>
                        Don't have an account? <Link to="/signup">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
