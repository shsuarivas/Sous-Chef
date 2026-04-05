import styles from './DefaultHomePage.module.scss';
import PageBar from './DefaultHomePageBar/DefaultHomePageBar/'
import WelcomingHeader from './TextComponents/Welcome.jsx'
import HomeImage from './Images/Image.jsx'

export default function HomePage(){
    return (
        <div className={styles.main_div}>
            <div className={styles.title_and_content_div}>
                <div className={styles.titlebar_div}>
                    <PageBar />
                </div>
                <nav>
                    <WelcomingHeader />
                </nav>
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <HomeImage />
                </div>
            </div>
        </div>
    );
};