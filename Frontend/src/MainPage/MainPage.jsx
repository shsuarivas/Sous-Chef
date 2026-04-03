import { useState } from 'react';

import styles from './MainPage.module.scss';

import TitleBar from './TitleBar/TitleBar.jsx';
import SideBar from './SideBar/SideBar.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import ExplorePage from './pages/ExplorePage/ExplorePage.jsx';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage.jsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.jsx';

/*
    This container shows the title bar, the side bar, and the page content
*/

export default function MainPage() {
    let [currentPage, setCurrentPage] = useState('home');

    let currentPageContent;
    switch (currentPage) {
        case 'home':
            currentPageContent = (<HomePage />);
            break;
        case 'explore':
            currentPageContent = <ExplorePage />;
            break;
        case 'notifications':
            currentPageContent = <NotificationsPage />;
            break;
        case 'settings':
            currentPageContent = (<SettingsPage />);
            break;
    }

    return (
        <>
            <div className={styles.main_div}>
                <div className={styles.sidebar_div}>
                    <SideBar currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                </div>
                
                <div className={styles.title_and_content_div}>
                    <div className={styles.titlebar_div}>
                        <TitleBar />
                    </div>
                    <div className={styles.page_div}>
                        {currentPageContent}
                    </div>
                </div>
            </div>
        </>
    );
};