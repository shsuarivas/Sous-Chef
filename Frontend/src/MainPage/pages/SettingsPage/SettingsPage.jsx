import styles from './SettingsPage.module.scss';

export default function SettingsPage() {
    return (
        <>
            <div className={styles.outer_div}>
                <div className={styles.inner_div}>
                    <div className={styles.title}>Edit Profile</div>

                    <div className={styles.pfp_line_div}>
                        <img src=""></img>
                        <span>Change</span>
                    </div>

                    <div className={styles.fields_div}>
                        <div className={styles.fields_entry}>
                            <div className={styles.field_left}>
                                <div className={styles.field_title}>Username</div>
                                <div className={styles.field_value}>test</div>
                            </div>
                            <div className={styles.field_right}>
                                Edit
                            </div>
                        </div>

                        <div className={styles.fields_entry}>
                            <div className={styles.field_left}>
                                <div className={styles.field_title}>Email</div>
                                <div className={styles.field_value}>test@test.test</div>
                            </div>
                            <div className={styles.field_right}>
                                Edit
                            </div>
                        </div>

                        <div className={styles.fields_entry}>
                            <div className={styles.field_left}>
                                <div className={styles.field_title}>Phone #</div>
                                <div className={styles.field_value}>555-555-5555</div>
                            </div>
                            <div className={styles.field_right}>
                                Edit
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};