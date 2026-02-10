import styles from './TitleBar.module.scss';

function SearchBar() {
    return (
        <>
            <div className={styles.searchbar_div}>
                <input type="text"></input>
            </div>
        </>
    );
}

function AccountButton() {
    return (
        <>
            <div>
                Account
            </div>
        </>
    );
}

export default function TitleBar() {
    return (
        <>
            <div className={styles.main_div}>
                <SearchBar />
                <AccountButton />
            </div>
        </>
    );
};