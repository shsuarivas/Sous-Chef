import styles from '../Shared.module.scss';

export default function NotificationsPage() {
    return (
        <div className={styles.glass_container}>
            <div className={styles.page_header}>
                <h1 className={styles.title}>Notifications</h1>
                <p className={styles.subtitle}>Stay updated with your latest kitchen activity and chef interactions.</p>
            </div>

            <div style={{ 
                height: '200px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#475569',
                fontSize: '0.95rem'
            }}>
                No new notifications. You're all caught up!
            </div>
        </div>
    );
};