import styles from './ExplorePage.module.scss'
import { useNavigate } from 'react-router-dom';

 function Recipe({id, recipe_name, recipe_description, image_url, handleRecipeClick}) {
      return (
          <div 
            className={styles.recipe_div}
            onClick= {() => handleRecipeClick(id)}
          >       
           <img src= {image_url} alt={recipe_name} />
            <span>{recipe_name}</span>
          </div>
      );                                                                                                      
  }               
 

export default function ExplorePage() {
    const navigate = useNavigate(); 
    
    function handleRecipeClick(id) {
        navigate(`/main/recipe/${id}`)
    }

      let recipes = [];
      for (let i = 0; i < 20; i++) recipes.push(<Recipe />);
                                                                                                              
      return (
          <div className={styles.main_div}>                                                                   
              <div className={styles.feed_grid}>
                  {recipes}                                                                                   
              </div>
          </div>                                                                                              
      );          
  }
