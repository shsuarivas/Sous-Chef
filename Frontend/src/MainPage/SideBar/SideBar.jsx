import { NavLink } from 'react-router-dom';
import logo from '../../assets/souschef_logo.png'
import styles from './SideBar.module.scss';

function Entry({ to, children }) {
    return (
        <NavLink
            to={to}
            end={to === '/main'}
            className={styles.entry_div}
        >
            {({ isActive }) => (
                <div className={`${styles.entry_inner} ${isActive ? styles.entry_inner_selected : ''}`}>
                    {children}
                </div>
            )}
        </NavLink>
    );
}

export default function SideBar() {
    return (
        <>
            <div className={styles.main_div}>
                <div className={styles.logo_div}>
                    <img src={logo} alt="Sous-Chef Logo" className={styles.logo} />
                </div>

                <Entry to="/main">Home</Entry>
                <Entry to="/main/explore">Explore</Entry>
                <Entry to="/main/notifications">Notifications</Entry>
            </div>
        </>
    );
};
