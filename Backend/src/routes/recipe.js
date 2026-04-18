import express from 'express';
import { LoadRecipeById, LoadRecipeByName} from '../LoadRecipe.js';

const router = express.Router();

router.get('/:id', async (req, res) => 
{
    const recipe = await LoadRecipeById(req.params.id);
    res.json(recipe);
});

router.get('/:name', async (req, res) => 
{
    const recipe = await LoadRecipeByName(req.params.name);
    res.json(recipe);
});

export default router;