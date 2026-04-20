import styles from './ExplorePage.module.scss'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//passing prop to a function


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
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedTag, setSelectedTag] = useState(null);

    const navigate = useNavigate(); 
    

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
