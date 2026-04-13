import pool from '../db.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const BATCH_SIZE = 20;

async function fetchUnsplashImage(recipeName) {
    const query = encodeURIComponent(recipeName + ' food');
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`;

    const res = await fetch(url, {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
    });

    if (!res.ok) {
        console.error(`Unsplash error for "${recipeName}": ${res.status}`);
        return null;
    }

    const data = await res.json();
    if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
    }
    return null;
}

async function populateImages() {
    const client = await pool.connect();

    try {
        // Get recipes that don't have an image yet
        const { rows: recipes } = await client.query(`
            SELECT r.id, r.recipe_name
            FROM recipes r
            LEFT JOIN images i ON i.recipe_id = r.id
            WHERE i.recipe_id IS NULL
            LIMIT $1
        `, [BATCH_SIZE]);

        console.log(`Found ${recipes.length} recipes without images. Fetching...`);

        for (const recipe of recipes) {
            const imageUrl = await fetchUnsplashImage(recipe.recipe_name);
            if (imageUrl) {
                await client.query(
                    'INSERT INTO images (image_url, recipe_id) VALUES ($1, $2)',
                    [imageUrl, recipe.id]
                );
                console.log(`✓ ${recipe.recipe_name}`);
            } else {
                console.log(`✗ No image found for: ${recipe.recipe_name}`);
            }

            // Small delay to be respectful to the API
            await new Promise(r => setTimeout(r, 200));
        }

        const { rows: remaining } = await client.query(`
            SELECT COUNT(*) FROM recipes r
            LEFT JOIN images i ON i.recipe_id = r.id
            WHERE i.recipe_id IS NULL
        `);

        console.log(`\nDone. ${remaining[0].count} recipes still need images — run again next hour.`);
    } finally {
        client.release();
        pool.end();
    }
}

populateImages();
