import { useEffect, useState } from 'react';
import styles from './HomePage.module.scss';
import {useNavigate}  from 'react-router-dom';


function Recipe({ name, servings, imageUrl, onClick }) {
    return (
        <div className={styles.recipe_div} onClick={onClick}>
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

// the 8 broad category tags we know exist in the DB
const CATEGORY_TAGS = ['vegan', 'vegetarian', 'gluten-free', 'breakfast', 'lunch', 'dinner', 'dessert', 'snack'];

// cuisine tags that exist in the DB
const CUISINE_TAGS = ['american', 'french', 'italian', 'mexican', 'latin', 'mediterranean', 'greek', 'spanish', 'indian', 'asian', 'chinese', 'japanese', 'korean'];

export default function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [activeTag, setActiveTag] = useState(null); // null = no filter (show all)
    const navigate = useNavigate();

    // re-fetch whenever page or active tag changes
    useEffect(() => {
        const tagParam = activeTag ? `&tag=${activeTag}` : '';
        fetch(`${import.meta.env.VITE_API_URL}/recipes?page=${page}&limit=${LIMIT}${tagParam}`)
            .then(res => res.json())
            .then(data => {
                setRecipes(data.recipes);
                setTotal(data.total); // need total to calculate how many pages exist
            })
            .catch(err => console.error('Failed to fetch recipes:', err));
    }, [page, activeTag]);

    // when switching tags, reset back to page 1 so we don't land on an empty page
    function handleTagClick(tag) {
        setActiveTag(prev => prev === tag ? null : tag); // clicking the same tag deselects it
        setPage(1);
    }

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className={styles.main_div}>

        {/* tag filter buttons — split into category and cuisine rows*/}
            <div className={styles.tag_section}>
                <div className={styles.tag_filters}>
                    <span className={styles.tag_label}>Category</span>
                    {CATEGORY_TAGS.map(tag => (
                        <button
                            key={tag}
                            className={`${styles.tag_btn} ${activeTag === tag ? styles.tag_btn_active : ''}`}
                            onClick={() => handleTagClick(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
                <div className={styles.tag_filters}>
                    <span className={styles.tag_label}>Cuisine</span>
                    {CUISINE_TAGS.map(tag => (
                        <button
                            key={tag}
                            className={`${styles.tag_btn} ${activeTag === tag ? styles.tag_btn_active : ''}`}
                            onClick={() => handleTagClick(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.feed_grid}>
                {recipes.map(recipe => (
                    <Recipe
                        key={recipe.id}
                        name={recipe.recipe_name}
                        servings={recipe.servings}
                        imageUrl={recipe.image_url}
                        onClick={() => navigate(`/main/recipe/${recipe.id}`)}
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
