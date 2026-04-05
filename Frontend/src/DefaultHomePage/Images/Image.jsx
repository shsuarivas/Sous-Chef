import Image from '../../assets/HomePageImage.png'
import style from './Image.module.scss'

export default function ImageFunc() {
    return (
        <div className={style.wrapper}>
            <img src={Image} alt="Homepage Hero" className={style.center} />
        </div>
    )
};