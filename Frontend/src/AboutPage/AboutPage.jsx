import { useState } from 'react';
import styles from './AboutPage.module.scss';
import HomeImage from '../DefaultHomePage/Images/Image.jsx';
import PageBar from '../DefaultHomePage/DefaultHomePageBar/DefaultHomePageBar.jsx';

export default function AboutPage() {
    return (
        <div className={styles.page_container}>
            <div className={styles.titlebar}>
                <PageBar />
            </div>
            <div className={styles.content_container}>
                <div className={styles.image_section}>
                    <div className={styles.image_overlay}>
                        <HomeImage />
                    </div>
                </div>
                <div className={styles.form_section}>
                    <div className={styles.form_container}>
                        <h1 className={styles.title}>About Byte Your Fork</h1>
                        <div className={styles.about_content}>
                            <p><strong>Byte Your Fork</strong> is your ultimate companion for culinary adventures!</p>

                            <p>We make cooking accessible, fun, and delicious for everyone. From smart recipe recommendations to step-by-step guidance, we're here to transform your kitchen experience.</p>

                            <p>Join our community and discover the joy of cooking with Byte Your Fork!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}