import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

export default function Button({ label, href, onClick }) {
    const btnElement = (
        <button className={styles.button} onClick={onClick}>
            {label}
        </button>
    );

    if (href) {
        if (href.startsWith('http')) {
            return (
                <a href={href} target="_blank" rel="noreferrer" className={styles.linkWrapper}>
                    {btnElement}
                </a>
            );
        } else {
            return (
                <Link to={href} className={styles.linkWrapper}>
                    {btnElement}
                </Link>
            );
        }
    }

    return btnElement;
}
