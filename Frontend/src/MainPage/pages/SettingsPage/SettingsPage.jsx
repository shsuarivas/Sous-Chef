import styles from './SettingsPage.module.scss';

export default function SettingsPage() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className={styles.outer_div}>
            <div className={styles.inner_div}>
                <div className={styles.title}>Edit Profile</div>

                <div className={styles.pfp_line_div}>
                    <div className={styles.pfp_box}></div>
                    <button className={styles.edit_button}>Change Photo</button>
                </div>

                <div className={styles.fields_div}>
                    <div className={styles.fields_entry}>
                        <div className={styles.field_left}>
                            <div className={styles.field_title}>Username</div>
                            <div className={styles.field_value}>{user.username}</div>
                        </div>
                        <div className={styles.field_right}>
                            <button className={styles.edit_button}>Edit</button>
                        </div>
                    </div>

                    <div className={styles.fields_entry}>
                        <div className={styles.field_left}>
                            <div className={styles.field_title}>Email</div>
                            <div className={styles.field_value}>{user.email}</div>
                        </div>
                        <div className={styles.field_right}>
                            <button className={styles.edit_button}>Edit</button>
                        </div>
                    </div>

                    <div className={styles.fields_entry}>
                        <div className={styles.field_left}>
                            <div className={styles.field_title}>Password</div>
                            <div className={styles.field_value}>••••••••</div>
                        </div>
                        <div className={styles.field_right}>
                            <button className={styles.edit_button}>Reset</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
