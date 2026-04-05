import styles from './SettingsPage.module.scss';

export default function SettingsPage() {
    return (
        <div className={styles.outer_div}>
            <div className={styles.inner_div}>
                <div className={styles.title}>Account Profile</div>

                <div className={styles.pfp_line_div}>
                    <div className={styles.avatar_placeholder}>
                        R
                    </div>
                    <div className={styles.change_btn}>Change Avatar</div>
                </div>

                <div className={styles.fields_div}>
                    <div className={styles.fields_entry}>
                        <div className={styles.field_left}>
                            <div className={styles.field_title}>Username</div>
                            <div className={styles.field_value}>RatChef99</div>
                        </div>
                        <div className={styles.field_right}>
                            <div className={styles.edit_btn}>Edit</div>
                        </div>
                    </div>

                    <div className={styles.fields_entry}>
                        <div className={styles.field_left}>
                            <div className={styles.field_title}>Email Address</div>
                            <div className={styles.field_value}>chef@example.com</div>
                        </div>
                        <div className={styles.field_right}>
                            <div className={styles.edit_btn}>Edit</div>
                        </div>
                    </div>

                    <div className={styles.fields_entry}>
                        <div className={styles.field_left}>
                            <div className={styles.field_title}>Phone Number</div>
                            <div className={styles.field_value}>555-555-5555</div>
                        </div>
                        <div className={styles.field_right}>
                            <div className={styles.edit_btn}>Edit</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}