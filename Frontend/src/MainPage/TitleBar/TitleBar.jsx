import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TitleBar.module.scss';
//implementing search functionality in the front end - Gio
function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    
    async function handleSearch(e){
        const value = e.target.value;
        setQuery(value);
        if (!value) return  setResults([]);
        const res = await fetch (`${import.meta.env.VITE_API_URL}/search?q=${value}`);
        const data = await res.json();
        setResults(data);
    }

    return (
        <div className={styles.searchbar_div}>
            <input type="text" value={query} onChange={handleSearch} placeholder="Search recipes..." />
            {results.length > 0 && (
                <div className={styles.search_dropdown}>
                    {results.map(r => (
                        <div key={r.id} className={styles.search_item}>
                            <p>{r.recipe_name}</p>
                            <p>{r.recipe_description}</p>
                        </div>
                    ))}
                </div>
            )}
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
