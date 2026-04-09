import Image from './HomePageImage.png'
import style from './Image.module.scss'

export default function ImageFunc() {
    return (
                    <img src={Image} alt="image" className={style.center}/>
    )
};