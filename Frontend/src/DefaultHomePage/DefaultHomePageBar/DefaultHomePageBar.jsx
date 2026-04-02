import styles from './DefaultHomePageBar.module.scss';
import Logo from './Buttons/Logo/logo.jsx';
import AboutButton from './Buttons/AboutButton/AboutButton.jsx';
import LoginButton from './Buttons/LoginButton/LoginButton.jsx';
import SignupButton from './Buttons/SignupButton/SignupButton.jsx';





export default function TitleBar() {
    return (
        <>
        
            <div className={styles.main_div}>
                <Logo />
                <div className={styles.gap}><AboutButton />
                <LoginButton />
                <SignupButton /></div>
            </div>
        </>
    );
};