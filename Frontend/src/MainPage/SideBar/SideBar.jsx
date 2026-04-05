import { NavLink } from 'react-router-dom';
import logo from '../../assets/Sous_Chef_Logo.png'
import styles from './SideBar.module.scss';

function Entry({
    children,
    to
}) {
    return (
        <div className={styles.entry_div}>
            <NavLink 
                to={to} 
                className={({ isActive }) => 
                    `${styles.entry_inner} ${isActive ? styles.entry_inner_selected : ''}`
                }
                end={to === '/main'}
            >
                {children}
            </NavLink>
        </div>
    );
}

export default function SideBar() {
    return (
        <div className={styles.main_div}>
             <div className={styles.logo_div}>                                                                                       
                <img src={logo} alt="Sous-Chef Logo" className={styles.logo} />
            </div>  

            <Entry to="/main">
                <span>Home</span>
            </Entry>

            <Entry to="/main/explore">
                <span>Explore</span>
            </Entry>

            <Entry to="/main/notifications">
                <span>Notifications</span>
            </Entry>

            <div className={styles.gap}></div>

            <Entry to="/main/settings">
                <span>Settings</span>
            </Entry>
        </div>
    );
};