import styles from './DefaultHomePageBar.module.scss';
import Logo from './Buttons/Logo/logo.jsx';
import Button from '../../components/Button/Button.jsx';


export default function TitleBar() {
    return (
        <>

            <div className={styles.main_div}>
                <Logo />
                <div className={styles.gap}>
                    <Button label="About" href="/about" />
                    <Button label="Login" href="/login" />
                    <Button label="Sign Up" href="/signup" />
                </div>
            </div>
        </>
    );
};