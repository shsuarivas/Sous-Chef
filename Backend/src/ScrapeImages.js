import pool from '../db.js';

async function fetchBudgetBytesImage(recipeName) {
    const query = encodeURIComponent(recipeName);
    const searchUrl = `https://www.budgetbytes.com/?s=${query}`;

    try {
        const res = await fetch(searchUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(15000),
        });

        if (!res.ok) {
            console.error(`Search failed for "${recipeName}": ${res.status}`);
            return null;
        }

        const html = await res.text();
        const match = html.match(/<article[^>]*>[\s\S]*?<img[^>]+src="(https:\/\/www\.budgetbytes\.com\/wp-content\/uploads\/[^"]+)"/);
        if (match) return match[1];
    } catch (err) {
        console.error(`Timeout/error for "${recipeName}": ${err.message}`);
    }

    return null;
}

async function scrapeImages() {
    const client = await pool.connect();

    try {
        const { rows: recipes } = await client.query(`
            SELECT r.id, r.recipe_name
            FROM recipes r
            LEFT JOIN images i ON i.recipe_id = r.id
            WHERE i.recipe_id IS NULL
            LIMIT 500
        `);

        console.log(`Found ${recipes.length} recipes without images.`);

        for (const recipe of recipes) {
            const imageUrl = await fetchBudgetBytesImage(recipe.recipe_name);
            if (imageUrl) {
                await client.query(
                    'INSERT INTO images (image_url, recipe_id) VALUES ($1, $2)',
                    [imageUrl, recipe.id]
                );
                console.log(`✓ ${recipe.recipe_name}`);
            } else {
                console.log(`✗ No image found for: ${recipe.recipe_name}`);
            }

            await new Promise(r => setTimeout(r, 100));
        }
    } finally {
        client.release();
        pool.end();
    }
}

scrapeImages();
