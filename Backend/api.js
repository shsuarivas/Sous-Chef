import express from 'express';
import recipeRouter from './routes/recipe.js';

const router = express.Router();

router.use('/recipe', recipeRouter);

export default router;