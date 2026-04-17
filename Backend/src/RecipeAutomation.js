import pool from '../db.js';
import recipes from '../recipes.json' with {type: 'json'};

async function insertRecipe(client, recipe)
{
  // Insert recipe
  await client.query(
    'INSERT INTO recipes (recipe_name, recipe_description, servings, time_to_cook) VALUES ($1, $2, $3, $4)',
    [recipe.name, recipe.description, recipe.servings, recipe.time_to_cook]
  );

  // Get the recipe ID
  const recipeId = ( await client.query('SELECT id FROM recipes WHERE recipe_name = $1', [recipe.name] )).rows[0].id;

  // insert steps
  await insertSteps(client, recipe, recipeId);

  // insert ingredients
  await insertIngredient(client, recipe, recipeId);

  // insert tags
  await insertTags(client, recipe, recipeId);

  // insert image
  await insertImage(client, recipe, recipeId);
}

// --------------------- Insert Steps Function --------------------- //
async function insertSteps(client, recipe, recipeId)
{
  for (const step of recipe.steps)
  {
    await client.query('INSERT INTO steps (recipe_id, step_number, instruction) VALUES ($1, $2, $3)', [recipeId, step.step_number, step.instruction]);
  }
}

// --------------------- Insert Ingredients Function --------------------- //
async function insertIngredient(client, recipe, recipeId)
{
  for (const ingredient of recipe.ingredients) {
    await client.query('INSERT INTO ingredients (ingredient_name) VALUES ($1)', [ingredient.ingredient_name]);

    const ingredientId = (await client.query('SELECT id FROM ingredients WHERE ingredient_name = $1', [ingredient.ingredient_name])).rows[0].id;

    const unitId = await insertUnit(client, ingredient);

    await client.query(
      'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit_id) VALUES ($1, $2, $3, $4)',
      [recipeId, ingredientId, ingredient.quantity, unitId]
    );
  }
}

// --------------------- Insert Units Function --------------------- //
async function insertUnit(client, ingredient)
{
    const unitName = ingredient.unit ? ingredient.unit : "None";

    const unitExists = await client.query('SELECT id FROM units WHERE unit_name = $1', [unitName]);

    if(unitExists.rows.length == 0)
    {
      await client.query('INSERT INTO units (unit_name) VALUES ($1)', [unitName]);
    }
    return (await client.query('SELECT id FROM units WHERE unit_name = $1', [unitName])).rows[0].id;
}

// --------------------- Insert Tags Function --------------------- //
async function insertTags(client, recipe, recipeId)
{
  for (const tag_name of recipe.tags) {

    const tagExists = await client.query('SELECT id FROM tags WHERE tag_name = $1', [tag_name]);
    if(tagExists.rows.length == 0)
    {
      await client.query('INSERT INTO tags (tag_name) VALUES ($1)', [tag_name]);
    }

    const tagId = (await client.query('SELECT id FROM tags WHERE tag_name = $1', [tag_name])).rows[0].id;

    await client.query('INSERT INTO recipe_tags (recipe_id, tag_id) VALUES ($1, $2)',[recipeId, tagId]);
  }
}

async function insertImage(client, recipe, recipeId)
{
  if (recipe.imageUrl)
  {
    await client.query('INSERT INTO images (image_url, recipe_id) VALUES ($1, $2)',[recipe.imageUrl, recipeId]);
  }
}

// --------------------- Loop Through Recipes Function --------------------- //
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

LoopThroughRecipes();
