import styles from '../HomePage/HomePage.module.scss';

export default function ExplorePage() {
    return (
        <div className={styles.main_div}>
            <div className={styles.category_div}>
                <div className={styles.category_title}>Explore New Flavors</div>
                <div className={styles.category_grid}>
                    <div className={styles.recipe_div}></div>
                    <div className={styles.recipe_div}></div>
                    <div className={styles.recipe_div}></div>
                    <div className={styles.recipe_div}></div>
                    <div className={styles.recipe_div}></div>
                    <div className={styles.recipe_div}></div>
                    <div className={styles.recipe_div}></div>
                    <div className={styles.recipe_div}></div>
                </div>
            </div>
        </div>
    );
};