import styles from './SideBar.module.scss';

function Entry({
    children,
    onClick,
    isActive,
}) {
    let className = `${styles.entry_inner} ${isActive ? styles.entry_inner_selected : ''}`; // If selected, add entry_inner_selected class

    return (
        <>
            <div className={styles.entry_div} onClick={onClick}>
                <div className={className}>
                    {children}
                </div>
            </div>
        </>
    );
}

export default function SideBar({
    currentPage,
    setCurrentPage,
}) {
    return (
        <>
            <div className={styles.main_div}>
                <Entry onClick={() => setCurrentPage('home')} isActive={false}>
                    Logo
                </Entry>

                <Entry
                    onClick={() => setCurrentPage('home')}
                    isActive={currentPage == 'home'}
                >
                    Home
                </Entry>

                <Entry
                    onClick={() => setCurrentPage('explore')}
                    isActive={currentPage == 'explore'}
                >
                    Explore
                </Entry>

                <Entry
                    onClick={() => setCurrentPage('notifications')}
                    isActive={currentPage == 'notifications'}
                >
                    Notifications
                </Entry>

                <div className={styles.gap}></div>

                <Entry
                    onClick={() => setCurrentPage('settings')}
                    isActive={currentPage == 'settings'}
                >
                    Settings
                </Entry>
            </div>
        </>
    );
};