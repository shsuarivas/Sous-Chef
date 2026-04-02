import { useState } from 'react';

import styles from './DefaultHomePage.module.scss';
import PageBar from './DefaultHomePageBar/DefaultHomePageBar/'
import WelcomingHeader from './TextComponents/Welcome.jsx'
import HomeImage from './Images/Image.jsx'

export default function HomePage(){

    let [count, setCount] = useState('home');

    let currentPageContent;
    switch(count){
        case 'home':
        currentPageContent = (< PageBar/>);
        break;
    }
    
    return (
            <>
                <div className={styles.main_div}>
                <div className={styles.title_and_content_div}>
                    <div className={styles.titlebar_div}>
                        <PageBar />
                    </div>
                    <nav>
                        <WelcomingHeader />
                    </nav>
                    <HomeImage />
                </div>
                </div>
            </>
        );
};