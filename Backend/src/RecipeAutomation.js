import pool from '../db.js';
import recipes from '../recipes.json' with {type: 'json'};

async function insertRecipe(client, recipe) 
{
  //console.log(`Inserting recipe: ${recipe.name}`);
  // Insert recipe
  await client.query(
    'INSERT INTO recipes (recipe_name, recipe_description, servings, time_to_cook, created_by) VALUES ($1, $2, $3, $4, $5)',
    [recipe.name, recipe.description, recipe.servings, recipe.timeToCook, recipe.createdBy]
  );

  // Get the recipe ID
  const recipeId = ( await client.query('SELECT id FROM recipes WHERE recipe_name = $1', [recipe.name] )).rows[0].id;

  // insert steps
  for (const step of recipe.steps) {
    //console.log(`Inserting step: ${step.step_number}`);
    await client.query('INSERT INTO steps (recipe_id, step_number, instruction) VALUES ($1, $2, $3)', [recipeId, step.step_number, step.instruction]);
  }

  // insert ingredients
  for (const ingredient of recipe.ingredients) {
    await client.query('INSERT INTO ingredients (ingredient_name) VALUES ($1)', [ingredient.ingredient_name]);

    // Get the ingredient ID
    const ingredientId = (await client.query('SELECT id FROM ingredients WHERE ingredient_name = $1', [ingredient.ingredient_name])).rows[0].id;

    // recipe and ingredient relationship
    await client.query(
      'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit_id) VALUES ($1, $2, $3, $4)',
      [recipeId, ingredientId, ingredient.quantity, ingredient.unitId]
    );
  }

  // insert tags
  /*
  for (const tagId of recipe.tags) {
    await client.query('INSERT INTO recipe_tags (recipe_id, tag_id) VALUES ($1, $2)',[recipeId, tagId]);
  }
  */

  // insert image
  if (recipe.imageUrl) {
    await client.query('INSERT INTO images (image_url, recipe_id) VALUES ($1, $2)',[recipe.imageUrl, recipeId]);
  }
}

async function LoopThroughRecipes() 
{
  const client = await pool.connect();

  try 
  {
    await client.query('BEGIN');
    for (const recipe of recipes) 
    {
      console.log(`Processing recipe: ${recipe.name}`);
      await insertRecipe(client, recipe);
    }
    await client.query('COMMIT');
  } 
  
  catch (err) 
  {
    await client.query('ROLLBACK');
    console.error('Error:', err.message);
  } 
  
  finally
  {
    client.release();
    pool.end();
  }
}

const client = await pool.connect();
await client.query('BEGIN');
await insertRecipe(client, recipes[0]);
await client.query('COMMIT');
client.release();
pool.end();
//LoopThroughRecipes();