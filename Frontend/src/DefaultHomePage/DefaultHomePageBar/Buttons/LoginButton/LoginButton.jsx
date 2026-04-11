
import { Link } from 'react-router-dom';
import styles from './LoginButton.module.scss';

export default function LoginButton(){
    return (
        <>
            <Link to="/signin">
                <button className={styles.loginbutton}>Login</button>
            </Link>
        </>
    );
};