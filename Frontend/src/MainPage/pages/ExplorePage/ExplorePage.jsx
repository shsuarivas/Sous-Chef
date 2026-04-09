import styles from './ExplorePage.module.scss'
export default function ExplorePage() {
    return (
        <>
            <h1>Explore</h1>
            <div className={styles.dish_div}>
                         <button className = {styles.dish_module} onClick={() => window.location.href = 'https://www.pinterest.com/'}>
                        Kosher</button>
                        <button className = {styles.dish_module} onClick={() => window.location.href = 'https://www.pinterest.com/'}>
                        Japanses</button>
                        <button className = {styles.dish_module} onClick={() => window.location.href = 'https://www.pinterest.com/'}>
                        Brunch</button>
                        </div>
                        <div className = {styles.dish_div}>
                        <button className = {styles.dish_module} onClick={() => window.location.href = 'https://www.pinterest.com/'}>
                        Dinner</button>
                        <button className = {styles.dish_module} onClick={() => window.location.href = 'https://www.pinterest.com/'}>
                        Vegan</button>
                        <button className = {styles.dish_module} onClick={() => window.location.href = 'https://www.pinterest.com/'}>
                        Place Holder</button>
            </div>
        </>
    );
};