import styles from './ExplorePage.module.scss'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

 function Recipe() {
      return (
          <div className={styles.recipe_div}>                                                                 
          </div>
      );                                                                                                      
  }               
 

export default function ExplorePage() {
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
