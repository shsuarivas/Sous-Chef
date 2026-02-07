import style from './Sidebar.module.scss'

function Sidebar() {
    return(
        <>  
        <div className={style.sidebar}>
            <div className={style.logo}>
            Sous Chef
            </div>

            <div className={style.explore_button}>
            Explore
            </div>

            <div className={style.notification_button}>
            Notifications
            </div>

            <div className={style.settings_button}>
            Settings
            </div>
        </div>
        </>
    )
}

export default Sidebar;