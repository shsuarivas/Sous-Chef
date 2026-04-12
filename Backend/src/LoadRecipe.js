import { Recipe } from "./DatabaseModules/Recipe.js";
import { CommentSection } from "./DatabaseModules/CommentSection.js";
import { Social } from "./DatabaseModules/Social.js";
import{ DishModule } from "./DatabaseModules/DishModule.js";

async function LoadRecipe(recipeName)
{
    const recipeData = await client.query('SELECT id FROM recipes WHERE recipe_name = $1', [recipeName]);
    const recipeId = recipeData.rows[0].id;
    return LoadRecipe(recipeId);
}

async function LoadRecipe(recipeId)
{
    const recipeData = await client.query('SELECT * FROM recipes WHERE id = $1', [recipeId]);
    
    const ingredientData = await client.query('SELECT * FROM recipe_ingredients WHERE recipe_id = $1', [recipeId]);
    
    const ingredientName = await client.query('SELECT * FROM ingredient WHERE id = $1', [ingredientID]);

    const stepData = await client.query('SELECT * FROM steps WHERE recipe_id = $2 ORDER BY step_number', [recipeId]);

    const recipe = new Recipe(
        recipeData.rows[0].recipe_name, 
        recipeData.rows[0].description, 
        recipeData.rows[0].prep_time, 
        recipeData.rows[0].cook_time, 
        recipeData.rows[0].servings,
        
    );

    return JSON.stringify(recipe);
}