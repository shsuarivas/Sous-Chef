import { useEffect, useState } from 'react';
import styles from './HomePage.module.scss';

function Recipe({ name, description, servings, imageUrl }) {
    return (
        <div className={styles.recipe_div}>
            <div className={styles.recipe_image_wrapper}>
                {imageUrl
                    ? <img src={imageUrl} alt={name} className={styles.recipe_img} />
                    : <div className={styles.recipe_placeholder} />
                }
            </div>
            <div className={styles.recipe_info}>
                <p className={styles.recipe_name}>{name}</p>
                <p className={styles.recipe_servings}>Serves {servings}</p>
            </div>
        </div>
    );
}

export default function HomePage() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/recipes`)
            .then(res => res.json())
            .then(data => setRecipes(data))
            .catch(err => console.error('Failed to fetch recipes:', err));
    }, []);

    return (
        <div className={styles.main_div}>
            <div className={styles.feed_grid}>
                {recipes.map(recipe => (
                    <Recipe
                        key={recipe.id}
                        name={recipe.recipe_name}
                        description={recipe.recipe_description}
                        servings={recipe.servings}
                        imageUrl={recipe.image_url}
                    />
                ))}
            </div>
        </div>
    );
}
