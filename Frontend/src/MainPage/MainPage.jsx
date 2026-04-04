import { useState, useEffect } from 'react';

import styles from './MainPage.module.scss';

import TitleBar from './TitleBar/TitleBar.jsx';
import SideBar from './SideBar/SideBar.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import ExplorePage from './pages/ExplorePage/ExplorePage.jsx';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage.jsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.jsx';

/*
    This container shows the title bar, the side bar, and the page content
*/

export default function MainPage() {
    let [currentPage, setCurrentPage] = useState('home');

 // Gemini Live Text Feature Starts
    
    const steps = 
           ["The following provides a default example of how Gemini reading steps are displayed..",
            "Step 1: Gather 2 bread slices, shredded lettuce, sliced tomatoes, deli meat, knife, and condiments.",
            "Step 2: Put lettuce, tomatoes, and deli meat on one slice of bread.",
            "Step 3: Add condiments on top.",
            "Step 4: Top it off with the other bread slice.",
            "Step 5: Cut the sandwich in half with your knife and enjoy!"];  // Default steps from Gemini
            
    const [stepIndex, setStepIndex] = useState(0);

            useEffect( () => {
                const interval = setInterval( () => {
                setStepIndex(prev => (prev + 1) % steps.length);  // Loops through list of steps
            }, 10000);                                            // every 10 seconds.
        
            return () => clearInterval(interval);  // Cleanup when component unmounts (properly stops timer).
        }, []);

          const recipeStep = steps[stepIndex] || "Loading..."; // Text of current step.

    
    let currentPageContent;
    switch (currentPage) {
        case 'home':
            currentPageContent = (<HomePage />);
            break;
        case 'explore':
            currentPageContent = <ExplorePage />;
            break;
        case 'notifications':
            currentPageContent = <NotificationsPage />;
            break;
        case 'settings':
            currentPageContent = (<SettingsPage />);
            break;
    }

    return (
        <>
            <div className={styles.main_div}>
                <div className={styles.sidebar_div}>
                    <SideBar currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                </div>
                
                <div className={styles.title_and_content_div}>
                    <div className={styles.titlebar_div}>
                        <TitleBar />
                    </div>
                    <div className={styles.page_div}> 
                        {currentPageContent} 

                       {/* Displays current Gemini Live Text Step (customized) */}
                    <div style = {{ textAlign: 'center', marginTop: '20px',
                                    border: '2px solid #870000', borderRadius: '10px',
                                    padding: '15px', backgroundColor: '#fff9f0',
                                    maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto',
                                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
                                 }}> 

                        <h2 style = {{fontFamily: 'Helvetica, monospace', color: '#000000', marginBottom: '10px'}}> 
                        Gemini Live Text </h2>

                        <p style = {{ fontFamily: 'Helvetica, monospace', fontSize: '18px', color: '#870000', marginTop: '10px' }}> 
                          {recipeStep} </p>
                    </div> 
                    </div>
                </div>
            </div>
        </>
    );
};