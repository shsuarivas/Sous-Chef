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
