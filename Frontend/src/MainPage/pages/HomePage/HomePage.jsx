import styles from './HomePage.module.scss';

function Recipe() {
    return (
        <>
            <div className={styles.recipe_div}>

            </div>
        </>
    );
}

function RecipeCategory({
    categoryName,
    recipes,
}) {
    return (
        <>
            <div className={styles.category_div} >
                <span className={styles.category_title}>{categoryName}</span>
                <div className={styles.category_grid}>
                    {recipes}
                </div>
            </div>
        </>
    );
}

export default function HomePage() {
    let recipes1 = [];
    for (let i=0; i<5; i++) recipes1.push(<Recipe />);

    let recipes2 = [];
    for (let i=0; i<16; i++) recipes2.push(<Recipe />);

    let recipes3 = [];
    for (let i=0; i<8; i++) recipes3.push(<Recipe />);

    return (
        <>
            <div className={styles.main_div}>
                <RecipeCategory categoryName="Soup" recipes={recipes1} />
                <RecipeCategory categoryName="Pasta" recipes={recipes2} />
                <RecipeCategory categoryName="Barbecue" recipes={recipes3} />
            </div>
        </>
    );
};