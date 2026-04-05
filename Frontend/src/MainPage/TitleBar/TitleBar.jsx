import styles from './TitleBar.module.scss';

function SearchBar() {
    return (
        <div className={styles.searchbar_div}>
            <input type="text" placeholder="Search recipes, chefs, tags..."></input>
        </div>
    );
}

function AccountButton() {
    return (
        <div className={styles.accountButton}>
            Account
        </div>
    );
}

export default function TitleBar() {
    return (
        <div className={styles.main_div}>
            <div className={styles.left_section}>
                <AccountButton />
            </div>
            
            <div className={styles.center_section}>
                <SearchBar />
            </div>

            <div className={styles.right_section}>
                {/* Placeholder for future buttons/logout to balance the UI */}
            </div>
        </div>
    );
};