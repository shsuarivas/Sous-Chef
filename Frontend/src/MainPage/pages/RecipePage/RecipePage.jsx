import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from  'react';
import styles from './RecipePage.module.scss';

export default function RecipePage(){
	// grab the recipe id from the URL
	const {id} = useParams();
	const [recipe,setRecipe] = useState(null);
	const [ratingData, setRatingData] = useState({average: null, count: 0});
	const user = JSON.parse(localStorage.getItem('user'));
	const [userRating, setUserRating] = useState(0); //different from ratingData, userRating is the rating the user selects for a recipe
	const [userFavorite, setUserFavorite] = useState(false);

	// fetch full recipe details whenever the id changes
	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}`)
			.then (res  => res.json())
			.then (data => setRecipe(data))
			.catch(err => console.error('Failed to fetch recipe :(((', err));
	},[id]);

	//fetch recipe total ratings
	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}/ratings`)
			.then (res => res.json())
			.then (data => setRatingData(data))
				.catch(err => console.error(' bruh this failed to fetch ratings dawg', err));
	},[id]);

	//fetch recipe ratings for the CURRENT user
	useEffect(() => {
		setUserRating(0);
		if (!user) return; //guard incase the current user is not logged in
		fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}/ratings/user?user_id=${user.id}`)
			.then (res => res.json())
			.then (data => setUserRating(data?.rating || 0))
			.catch(err => console.error('Failed to fetch recipe ratings for the current user :(((', err));
	},[id]);

	// useEffect for the fork status for CURRENT user. this will allow the recipe page to fetch fork status
	useEffect(() => {
		setUserFavorite(false);
		if (!user) return;
		fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}/favorites?user_id=${user.id}`)
			.then (res => res.json())
			.then (data => setUserFavorite(data.forked))
			.catch(err => console.error('Failed to fetch fork status :(((', err));
	}, [id]);

	// Front end logic for users to actually rate recipes.
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
			//refresh the average after submitting new rating
				fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}/ratings`)
					.then(res => res.json())
					.then(data => setRatingData(data))
					.catch(err => console.error('bruh this failed to fetch ratings dawg', err));
		})
		.catch(err => console.error('Failed to submit rating', err));
	}

	// function for Users to submit forks, send the request to the DB
	function submitUserFavorite(){
		if(!user) return;
		fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}/favorites`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ user_id: user.id })
		})
		.then(res => res.json())
		.then(data => setUserFavorite(data.forked))
		.catch(err => console.error('Failed to submit fork', err));
	}

	return(
		<div>
		{/* don't render anything until the data comes back*/}
		{recipe && (
			<>
			<img src={recipe.image_url} alt={recipe.recipe_name}/>
			<h1>{recipe.recipe_name}</h1>
			<p> Serves {recipe.servings} | Prep Time: {recipe.time_to_cook} min(s)</p>

			{/*Start cooking button!! :))) */}
			<div className={styles.startCookingContainer}>
				<Link to={`/cook/${id}`} className={styles.startCookingLink}>
					<button
						type="button"
						className={styles.startCookingButton}
					>
						Start Cooking
					</button>
				</Link>
			</div>

		{/*Fork logic and button!*/}
		<button onClick={submitUserFavorite} style={{marginBottom: '1.5em'}}>
		{userFavorite ? 'Forked!' : 'Fork This Recipe!'} </button>
		{/* Star logic */}
			<div>
			<span style={{fontWeight: 'bold'}}> Rate This Recipe! </span>
			<div></div>
					{[1,2,3,4,5].map(star =>  (
						<span
						key={star}
						onClick={() =>  submitRating(star)}
						style={{cursor: 'pointer', fontSize: '1.5rem', color: star <= userRating ? 'gold' : 'grey' }}
						>
						★
						</span>
					))}
					<br></br>
				<span> {ratingData.average ? `Overall Recipe Rating: ${ratingData.average}/5 (${ratingData.count} total ratings)` : 'No ratings yet'}</span>
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
