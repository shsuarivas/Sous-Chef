import { StartDatabaseConnection } from '../db.js';

export async function LoadRecipeByName(recipeName)
{
    return StartDatabaseConnection(async (client) => 
    {
        const recipeData = await client.query('SELECT id FROM recipes WHERE recipe_name = $1', [recipeName]);
        const recipeId = recipeData.rows[0].id;
        return LoadRecipe(recipeId);
    });
}

export async function LoadRecipeById(recipeId)
{
    return StartDatabaseConnection(async (client) => 
    {
        const recipeData = await client.query('SELECT * FROM recipes WHERE id = $1', [recipeId]);

        const ingredients = await LoadIngredients(client, recipeId);
        const steps = await LoadSteps(client, recipeId);
        const tags = await LoadTags(client, recipeId);
        const nutrition = await LoadNutrition(client, recipeId);

        const recipe = {
            name: recipeData.rows[0].recipe_name,
            description: recipeData.rows[0].recipe_description,
            servings: recipeData.rows[0].servings,
            time_to_cook: recipeData.rows[0].time_to_cook,
            image_url: recipeData.rows[0].image_url,
            ingredients: ingredients,
            steps: steps,
            tags: tags,
            nutrition: nutrition
        };

        return recipe;
    });
}

async function LoadIngredients(client, recipeId)
{
    const ingredientData = await client.query('SELECT * FROM recipe_ingredients WHERE recipe_id = $1', [recipeId]);
    const ingredientList = [];

    for (const ingredient of ingredientData.rows){
        
        const ingredientName = await client.query('SELECT ingredient_name FROM ingredients WHERE id = $1', [ingredient.ingredient_id]);
        const unit = await client.query('SELECT unit_name FROM units WHERE id = $1', [ingredient.unit_id]);

        ingredientList.push({
            ingredient_name: ingredientName.rows[0].ingredient_name,
            quantity: ingredient.quantity,
            unit: unit.rows[0].unit_name
        });
        
    }
    return ingredientList;
}

async function LoadSteps(client, recipeId)
{
    const stepData = await client.query('SELECT step_number, instruction FROM steps WHERE recipe_id = $1 ORDER BY step_number', [recipeId]);
    return stepData.rows.map(step => ({
        step_number: step.step_number,
        instruction: step.instruction
    }));
}

async function LoadTags(client, recipeId)
{
    const tagId = await client.query('SELECT tag_id FROM recipe_tags WHERE recipe_id = $1', [recipeId]);
    const tagList = [];

    for (const id of tagId.rows)
    {
        const tag = (await client.query('SELECT tag_name FROM tags WHERE id = $1', [id.tag_id])).rows[0];
        tagList.push(tag);
    }
    return tagList;
}

async function LoadNutrition(client, recipeId)
{
    const nutrition = await client.query('SELECT * FROM nutrition WHERE recipe_id = $1', [recipeId]);

    if (!nutrition.rows[0]) return null;

    return {
        calories: nutrition.rows[0].calories,
        fatContent: nutrition.rows[0].fat_content,
        proteinContent: nutrition.rows[0].protein_content,
        carbohydrateContent: nutrition.rows[0].carbohydrate_content
    }
}