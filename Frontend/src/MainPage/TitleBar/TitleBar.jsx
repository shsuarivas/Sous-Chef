import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TitleBar.module.scss';

function SearchBar() {
    return (
        <div className={styles.searchbar_div}>
            <input type="text" />
        </div>
    );
}

function AccountButton() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleSignOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    }

    return (
        <div className={styles.account_wrapper} ref={ref}>
            <button className={styles.account_button} onClick={() => setOpen(prev => !prev)}>
                {user.username || 'Account'}
            </button>

            {open && (
                <div className={styles.dropdown}>
                    <button
                        className={styles.dropdown_item}
                        onClick={() => { navigate('/main/settings'); setOpen(false); }}
                    >
                        Settings
                    </button>
                    <div className={styles.dropdown_divider} />
                    <button
                        className={`${styles.dropdown_item} ${styles.dropdown_item_signout}`}
                        onClick={handleSignOut}
                    >
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}

export default function TitleBar() {
    return (
        <div className={styles.main_div}>
            <SearchBar />
            <AccountButton />
        </div>
    );
};
