import { useEffect, useState } from 'react';
import styles from './HomePage.module.scss';

function Recipe({ name, servings, imageUrl }) {
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

const LIMIT = 20; // how many recipes to show per page

export default function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // re-fetch whenever the page changes
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/recipes?page=${page}&limit=${LIMIT}`)
            .then(res => res.json())
            .then(data => {
                setRecipes(data.recipes);
                setTotal(data.total); // need total to calculate how many pages exist
            })
            .catch(err => console.error('Failed to fetch recipes:', err));
    }, [page]);

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className={styles.main_div}>
            <div className={styles.feed_grid}>
                {recipes.map(recipe => (
                    <Recipe
                        key={recipe.id}
                        name={recipe.recipe_name}
                        servings={recipe.servings}
                        imageUrl={recipe.image_url}
                    />
                ))}
            </div>

            {/* only show pagination if there's more than one page */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.page_btn}
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span className={styles.page_info}>Page {page} of {totalPages}</span>
                    <button
                        className={styles.page_btn}
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
