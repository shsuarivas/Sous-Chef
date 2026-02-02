import style from './RecipeGroup.module.scss'
import RecipeEntry from './RecipeEntry.jsx'

function RecipeGroup({
	name,
	recipes
}) {
	let recipesElements = recipes.map(name => <RecipeEntry name={name}/>);

	return (
		<>
			<div>
				<div className={style.header_div}>
					{name}
				</div>
				<div className={style.recipes_div}>
					{recipesElements}
				</div>
			</div>
		</>
	);
}

export default RecipeGroup;