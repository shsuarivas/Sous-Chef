import { useState } from 'react';

import styles from './DefaultHomePageBar.module.scss';
import Logo from './Buttons/Logo/logo.jsx';
import AboutButton from './Buttons/AboutButton/AboutButton.jsx';
import LoginButton from './Buttons/LoginButton/LoginButton.jsx';
import SigninButton from './Buttons/SigninButton/SigninButton.jsx';





export default function TitleBar() {
    return (
        <>
            <div className={styles.main_div}>
                <p>Logo</p>
            <div className={styles.gap}></div>
                <AboutButton />
                <LoginButton />
                <SigninButton />
            </div>
        </>
    );
};