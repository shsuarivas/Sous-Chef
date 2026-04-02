import Image from './HomePageImage.png'
import style from './Image.module.scss'

export default function ImageFunc() {
    return (
                    <img src={Image} alt="image" width="2000" height="400" className = {style.center}/>
    )
};