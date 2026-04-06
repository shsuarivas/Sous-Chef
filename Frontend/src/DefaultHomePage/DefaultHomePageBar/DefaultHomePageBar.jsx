import styles from './DefaultHomePageBar.module.scss';
import Logo from './Buttons/Logo/logo.jsx';
import Button from '../../components/Button/Button.jsx';


export default function TitleBar() {
    return (
        <>

            <div className={styles.main_div}>
                <Logo />
                <div className={styles.gap}>
                    <Button variant="whiteGhost" label="About" href="/about" />
                    <Button variant="whiteGhost" label="Login" href="/login" />
                    <Button variant="whiteSolid" label="Sign Up" href="/signup" />
                </div>
            </div>
        </>
    );
};