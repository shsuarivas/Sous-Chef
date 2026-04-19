import { useParams } from 'react-router-dom';
import { useState, useEffect } from  'react';

export default function RecipePage(){
	// grab the recipe id from the URL
	const {id} = useParams();
	const [recipe,setRecipe] = useState(null);
	const [ratingData, setRatingData] = useState({average: null, count: 0});
	const user = JSON.parse(localStorage.getItem('user'));
	const [userRating, setUserRating] = useState(0); //different from ratingData, userRating is the rating the user selects for a recipe
	const [userFavorite, setUserFavorite] = useState(false); // same React hook used in ratingData and setRatingData for user Forks!!!

	// fetch full recipe details whenever the id changes
	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}`)
			.then (res  => res.json())
			.then (data => setRecipe(data))
			.catch(err => console.error('Failed to fetch recipe :(((', err));
	},[id]);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}/ratings`)
			.then (res => res.json())
			.then (data => setRatingData(data))
				.catch(err => console.error(' bruh this failed to fetch ratings dawg', err));
	},[id]);

	// UI and front end logic for users to actually rate recipes.
	
	
	function submitRating(star){
		if (!user) return; //cant do nun if user not logged in
		setUserRating(star)
		fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}/ratings`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ user_id: user.id, rating: star })
		})
		.then(res => res.json())
		.then(() => {
			//refresh the average after submitting new ratiing
				fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}/ratings`)
					.then(res => res.json())
					.then(data => setRatingData(data))
					.catch(err => console.error('bruh this failed to fetch ratings dawg', err));
		})
		.catch(err => console.error('Failed to submit rating', err));
	}

	
	function submitUserFavorite(){
		if(!user) return;
		setUserFavorite(!userFavorite)
		fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}/forks`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ user_id: user.id, recipe_id: recipe.id})
		})
		.then(res => res.json())
		.then(() => {
			//refresh the favorites after favoriting the recipe
				fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}/forks`)
					.then(res => res.json())
					.then(data => setUserFavorite(data))
					.catch(err => console.error(' bruv this failed to fetch user forks', err));
		})
		.catch(err => console.error(' Failed to submit fork', err));

	}

	return(
		<div>
		{/* don't render anything until the data comes back*/}
		{recipe && (
			<>
			<img src={recipe.image_url} alt={recipe.recipe_name}/>
			<h1>{recipe.recipe_name}</h1>
			<p> Serves {recipe.servings} | Prep Time: {recipe.time_to_cook} min(s)</p>

		{/*Fork logic */}
		<button onClick={submitUserFavorite}> 
		{userFavorite ? 'Forked!' : 'Fork This Recipe!'} </button>

			

		{/* Star logic */}	
			<div>
					{[1,2,3,4,5].map(star =>  (
						<span
						key={star}
						onClick={() =>  submitRating(star)}
						style={{cursor: 'pointer', fontSize: '1.5rem', color: star <= userRating ? 'gold' : 'grey' }}
						>
						★
						</span>
					))}
				<span> {ratingData.average ? `${ratingData.average}/5 (${ratingData.count} ratings)` : 'No ratings yet'}</span>
			</div>

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


