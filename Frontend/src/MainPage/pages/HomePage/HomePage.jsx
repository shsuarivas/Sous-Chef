import styles from './HomePage.module.scss';

function Recipe() {
    return (
        <>
            <div className={styles.recipe_div}>

            </div>
        </>
    );
}
                                                                                                         
  export default function HomePage() {                                                                        
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