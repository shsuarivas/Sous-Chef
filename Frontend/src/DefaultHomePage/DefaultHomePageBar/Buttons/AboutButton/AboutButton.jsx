import { Link } from 'react-router-dom';
import styles from './AboutButton.module.scss';

export default function AboutButton(){
    return (
        <>
        <Link to="/about">
             <button className={styles.aboutbutton}>About</button>
        </Link>
        </>
    );
};