import logo from './Sous_Chef_Logo.png'
import styles from './logo.module.scss'
import { Link } from 'react-router-dom'

export default function Logo() {
    return (
        <Link to="/">
            <img src={logo} className={styles.logo} alt="byf logo" />
        </Link>
    );
};