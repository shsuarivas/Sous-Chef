import styles from '../Shared.module.scss';
import Button from '../../components/Button/Button.jsx';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/Sous_Chef_Logo.png';

// About page uses the form styles, but we center it completely without the split screen!
export default function About() {
    const navigate = useNavigate();

    return (
        <div className={styles.pageWrapper} style={{justifyContent: 'center', backgroundColor: '#0f172a'}}>
            <div className={styles.authCard} style={{maxWidth: '600px', textAlign: 'center'}}>
                <div className={styles.logoArea}>
                    <Link to="/"><img src={logo} alt="Logo" style={{width: '120px'}}/></Link>
                </div>

                <h1 className={styles.title} style={{textAlign: 'center'}}>About Byte Your Fork</h1>
                <p className={styles.subtitle} style={{textAlign: 'center'}}>
                    Byte Your Fork is a revolutionary app designed to help you cook amazing meals and organize your recipes. 
                    <br/><br/>
                    We built this platform with passion and modern web technologies to make your culinary journey completely seamless. The interface is highly responsive and engineered to help you thrive in the kitchen.
                </p>

                <div className={styles.buttonRow} style={{marginTop: '30px'}}>
                    <Button label="Return to Home" onClick={() => navigate('/')} />
                </div>
            </div>
        </div>
    );
}
