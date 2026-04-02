import styles from "./Welcome.module.scss"

export default function Header(){
    return(
        <section>
            <h1 className = {styles.format}>
                Welcome To Byte Your Fork!
            </h1>
        </section   >
    )
}