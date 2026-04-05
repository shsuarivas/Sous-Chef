import { Outlet } from 'react-router-dom';
import styles from './MainPage.module.scss';
import TitleBar from './TitleBar/TitleBar.jsx';
import SideBar from './SideBar/SideBar.jsx';

export default function MainPage() {
    return (
        <div className={styles.main_div}>
            <div className={styles.sidebar_div}>
                <SideBar />
            </div>
            
            <div className={styles.title_and_content_div}>
                <div className={styles.titlebar_div}>
                    <TitleBar />
                </div>
                <div className={styles.page_div}> 
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
};