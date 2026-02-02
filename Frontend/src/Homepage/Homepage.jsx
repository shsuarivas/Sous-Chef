import style from './Homepage.module.scss'
import TitleBar from './TitleBar.jsx'
import RecipeArea from './RecipeArea/RecipeArea.jsx'

function Homepage() {
  return (
    <>
      <div className={style.title_div}>
        <TitleBar />
      </div>

      <div className={style.recipes_div}>
        <RecipeArea />
      </div>
    </>
  );
}

export default Homepage;