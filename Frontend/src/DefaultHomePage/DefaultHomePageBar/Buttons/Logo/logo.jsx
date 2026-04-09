import logo from './Sous_Chef_Logo.png'
import styles from './logo.module.scss'

export default function Logo() {
    return (
        <a href = "/defaultHomePage" target="_blank" rel="noreferrer">
            <img src={logo} className={styles.logo} alt="byf logo" />
        </a>
    );
};