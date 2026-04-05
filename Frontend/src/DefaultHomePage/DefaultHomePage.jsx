import styles from './DefaultHomePage.module.scss';
import PageBar from './DefaultHomePageBar/DefaultHomePageBar/'
import WelcomingHeader from './TextComponents/Welcome.jsx'

export default function HomePage(){
    return (
        <div className={styles.main_div}>
            <div className={styles.title_and_content_div}>
                <div className={styles.titlebar_div}>
                    <PageBar />
                </div>
                <nav className={styles.hero_content}>
                    <WelcomingHeader />
                </nav>
            </div>
        </div>
    );
};