import styles from './ExplorePage.module.scss'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//passing prop to a function


 function Recipe({id, recipe_name, recipe_description, image_url, handleRecipeClick}) {
      return (
          <div 
            className={styles.recipe_div}
            onClick= {() => handleClickRecipe(id)}
          >       
           <img src= " "/>

          </div>
      );                                                                                                      
  }               
 

export default function ExplorePage() {
    const [recipes, setRecipes] = useState([]);

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
