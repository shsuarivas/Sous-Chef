

import { Link } from 'react-router-dom';
import styles from './SigninButton.module.scss';

export default function SignupButton(){
    return (
        <>
            <Link to="/signup">
                <button className={styles.signupbutton}>Sign Up</button>
            </Link>
        </>
    );
};