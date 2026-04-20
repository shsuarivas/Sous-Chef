import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
import pool from './db.js';
import authRouter from './src/routes/auth.js';
import userRouter from './src/routes/user.js';

const PORT = process.env.PORT || 8080;

let app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Test!');
});

// paginated recipe browsing — page, limit, and optional tag filter come in as query params
// e.g. /recipes?page=2&limit=20&tag=vegan
app.get('/recipes', async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20)); // cap at 50 so nobody requests 10000 recipes
    const offset = (page - 1) * limit;
    const tag = req.query.tag || null; // null means no filter, show everything

    try {
        // if a tag is provided we gotta join recipe_tags and tags to filter by it
        // otherwise just grab everything as usual
        const [result, countResult] = await Promise.all([
            pool.query(`
                SELECT DISTINCT r.id, r.recipe_name, r.recipe_description, r.servings, i.image_url
                FROM recipes r
                LEFT JOIN images i ON i.recipe_id = r.id
                ${tag ? 'JOIN recipe_tags rt ON rt.recipe_id = r.id JOIN tags t ON t.id = rt.tag_id' : ''}
                ${tag ? 'WHERE t.tag_name = $3' : ''}
                LIMIT $1 OFFSET $2
            `, tag ? [limit, offset, tag] : [limit, offset]),
            // count needs to respect the tag filter too so pagination stays accurate
            pool.query(
                tag
                    ? `SELECT COUNT(DISTINCT r.id) FROM recipes r JOIN recipe_tags rt ON rt.recipe_id = r.id JOIN tags t ON t.id = rt.tag_id WHERE t.tag_name = $1`
                    : `SELECT COUNT(*) FROM recipes`,
                tag ? [tag] : []
            )
        ]);

        // send back recipes + pagination metadata so the frontend knows how many pages exist
        res.json({
            recipes: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            limit
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get("/api/token", async (req, res) => {
  try {
    const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        liveConnectConstraints: {
          model: "gemini-3.1-flash-live-preview",
          config: {
            responseModalities: ["AUDIO"],
          }
        },
        httpOptions: { apiVersion: "v1alpha" },
      }
    });

    console.log("Full token object:", JSON.stringify(token));
    res.json({ token: token.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/search", async (req,res)  => {
    const q = req.query.q;
    if (!q) return res.json([]);
    
    //database callback
    
  try {
      const result = await pool.query(`
                SELECT r.id, r.recipe_name, r.recipe_description
                FROM recipes r
                WHERE r.search_vector @@ plainto_tsquery('english',$1)
                LIMIT 10
        `,[q]);
    
        res.json(result.rows);
  } 
    catch (err){
        console.error(err);
        res.status(500).json({ error: 'search failed'});
    }

});
    //used for recipe detail pages. Modular implementation using recipe id
app.get('/recipes/:id', async (req,res) => {
    const id = req.params.id

    try{
        const details = await pool.query(`
            SELECT r.id, r.recipe_description, r.recipe_name, r.servings, r.time_to_cook, i.image_url
            FROM recipes r
            LEFT JOIN images i ON i.recipe_id = r.id
            WHERE r.id = $1`
            ,[id]);


        const steps = await pool.query(`
            SELECT step_number, instruction
            FROM steps
            WHERE recipe_id = $1
            ORDER BY step_number`
            ,[id]);
        
        const ingredients = await pool.query(`
            SELECT i.ingredient_name, ri.quantity, u.unit_name
            FROM recipe_ingredients  ri
            JOIN ingredients i ON i.id = ri.ingredient_id
            LEFT JOIN units u ON u.id = ri.unit_id
            WHERE ri.recipe_id = $1`
            ,[id]);

        res.json({
            ...details.rows[0],
            ingredients: ingredients.rows,
            steps: steps.rows
        });
    }       

    catch(err){
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch recipe' });

    }
});
//Retriving ratings from the DB ACROSS ALL USERS
app.get('/recipes/:id/ratings', async (req,res) => {
    const id = req.params.id
try{
    const result = await pool.query(`
        SELECT ROUND(AVG(rating), 1) AS AVERAGE, COUNT(*) AS COUNT
        FROM ratings
        WHERE recipe_id = $1`
        , [id]);
    res.json(result.rows[0]);

}

catch(err){
    console.error(err);
    res.status(500).json({ error: 'Failed to get ratings'});
}
});


//Retrieve ratings from the Db for the CURRENT USER ONLY
app.get('/recipes/:id/ratings/user', async (req,res) => {
    const id = req.params.id
    const {user_id} = req.query
    try{
        const result = await pool.query(`
        SELECT rating 
        FROM ratings
        WHERE recipe_id = $1 AND user_id = $2
        `, [id, user_id]);

        res.json(result.rows[0]);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: 'Fail to get rating for the current user'});
}
});

// User submits ratings
app.post('/recipes/:id/ratings', async (req,res) => {
    const id = req.params.id
    const {user_id,rating} = req.body;

try{
    await pool.query(`
    INSERT INTO ratings (user_id, recipe_id, rating)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, recipe_id) DO UPDATE SET rating = $3`
        , [user_id, id, rating]);
    res.json({success:true});
}

catch(err){
    console.error(err);
    res.status(500).json({ error: 'Failed to submit rating'});

}
});

//find a way to add a software backdoor in this file
