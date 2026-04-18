import { useParams } from 'react-router-dom';
import { useState, useEffect } from  'react';

export default function RecipePage(){
	// grab the recipe id from the URL
	const {id} = useParams();
	const [recipe,setRecipe] = useState(null);

	// fetch full recipe details whenever the id changes
	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}`)
			.then (res  => res.json())
			.then (data => setRecipe(data))
			.catch(err => console.error('Failed to fetch recipe :(((', err));
	},[id]);

	return(
		<div>
		{/* don't render anything until the data comes back*/}
		{recipe && (
			<>
			<img src={recipe.image_url} alt={recipe.recipe_name}/>
			<h1>{recipe.recipe_name}</h1>
			<p> Serves {recipe.servings} * {recipe.time_to_cook} min(s)</p>

			<h2>Ingredients</h2>
			<ul style={{listStylePosition: 'inside'}}>
			    {recipe.ingredients.map((ing, i) =>  (
				    <li key={i}>{ing.quantity} {ing.unit_name} {ing.ingredient_name}</li>
			    ))}
			</ul>

			<h2> Steps </h2>
			<ol>
				{recipe.steps.map(step => (
					<li key={step.step_number}>{step.instruction}</li>
				))}
			</ol>
			</>
		)}
		</div>
	);
}


