import express from 'express'
import cors from 'cors'
import pool from './db.js'

const PORT = process.env.PORT || 8080;

let app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Test!');
});

app.get('/recipes', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.id, r.recipe_name, r.recipe_description, r.servings, i.image_url
            FROM recipes r
            LEFT JOIN images i ON i.recipe_id = r.id
            LIMIT 20
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});