import styles from './AboutButton.module.scss';

export default function AboutButton(){
    return (
        <>
        <a href = "/about" target="_blank">
             <button className={styles.aboutbutton}>About</button>
        </a>
        </>
    );
};