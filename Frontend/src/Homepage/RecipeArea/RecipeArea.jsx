import { useState, useEffect } from 'react'

import style from './RecipeArea.module.scss'
import RecipeGroup from './RecipeGroup.jsx'

function RecipeArea() {
  let recipesPasta = [];
  for (let i=0; i<20; i++) recipesPasta.push(`Pasta ${i}`);

  let recipesSoup = [];
  for (let i=0; i<10; i++) recipesSoup.push(`Soup ${i}`);

  const [backRecipes, setBackRecipes] = useState([]);

  async function getRecipes() {
    // Fetch recipe list from backend
    let response = await fetch('http://localhost:8080/recipes');
    let data = await response.json();

    if (data.recipes) {
      setBackRecipes(data.recipes);
    }
  }

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <>
      <div className={style.area_list}>
        <RecipeGroup name="Pasta" recipes={recipesPasta} />
        <RecipeGroup name="Soup" recipes={recipesSoup}/>
        <RecipeGroup name="New Recipes (test from backend)" recipes={backRecipes}/>
      </div>
    </>
  );
}

export default RecipeArea;