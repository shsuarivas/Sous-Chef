import { useState, useEffect } from 'react';
import styles from './HomePage.module.scss';

function Recipe() {
    return (
        <div className={styles.recipe_div}>
        </div>
    );
}

function RecipeCategory({ categoryName, recipes }) {
    return (
        <div className={styles.category_div}>
            <span className={styles.category_title}>{categoryName}</span>
            <div className={styles.category_grid}>
                {recipes}
            </div>
        </div>
    );
}

export default function HomePage() {
    const steps = [
        "Welcome! Your Live AI Assistant is ready.",
        "Step 1: Gather your ingredients and prepare your workstation.",
        "Step 2: Chop the vegetables into consistent, bite-sized pieces.",
        "Step 3: Sear the protein over medium-high heat until golden brown.",
        "Step 4: Combine the ingredients and let simmer for 15 minutes.",
        "Step 5: Plate beautifully, garnish with fresh herbs, and serve immediately!"
    ];
            
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex(prev => (prev + 1) % steps.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const recipeStep = steps[stepIndex] || "Loading...";

    let recipes1 = [];
    for (let i=0; i<5; i++) recipes1.push(<Recipe key={`r1-${i}`} />);

    let recipes2 = [];
    for (let i=0; i<16; i++) recipes2.push(<Recipe key={`r2-${i}`} />);

    let recipes3 = [];
    for (let i=0; i<8; i++) recipes3.push(<Recipe key={`r3-${i}`} />);

    return (
        <div className={styles.main_div}>
            <div className={styles.geminiLiveTextContainer}> 
                <h2 className={styles.geminiLiveTextTitle}>Live Assistant</h2>
                <p className={styles.geminiLiveTextStep}>{recipeStep}</p>
            </div> 

            <RecipeCategory categoryName="Soup" recipes={recipes1} />
            <RecipeCategory categoryName="Pasta" recipes={recipes2} />
            <RecipeCategory categoryName="Barbecue" recipes={recipes3} />
        </div>
    );
}