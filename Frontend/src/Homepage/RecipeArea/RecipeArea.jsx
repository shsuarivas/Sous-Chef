import { useState, useEffect } from 'react'

import style from './RecipeArea.module.scss'
import RecipeGroup from './RecipeGroup.jsx'

function RecipeArea() {
  let recipesPasta = [];
  for (let i=0; i<20; i++) recipesPasta.push(`Pasta ${i}`);

  let recipesSoup = [];
  for (let i=0; i<10; i++) recipesSoup.push(`Soup ${i}`);

	useEffect(async () => {
		// Try to fetch recipe list from backend

	});

	return (
		<>
			<div className={style.area_list}>
				<RecipeGroup name="Pasta" recipes={recipesPasta} />
				<RecipeGroup name="Soup" recipes={recipesSoup}/>
			</div>
		</>
	);
}

export default RecipeArea;