import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import styles from './MainPage.module.scss';

import TitleBar from './TitleBar/TitleBar.jsx';
import SideBar from './SideBar/SideBar.jsx';

/*
    This container shows the title bar, the side bar, and the page content.
    Child routes (home, explore, notifications, settings) are rendered via <Outlet />.
*/

export default function MainPage() {

    // Gemini Live Text Feature Starts
    const steps =
           ["The following provides a default example of how Gemini reading steps are displayed..",
            "Step 1: Gather 2 bread slices, shredded lettuce, sliced tomatoes, deli meat, knife, and condiments.",
            "Step 2: Put lettuce, tomatoes, and deli meat on one slice of bread.",
            "Step 3: Add condiments on top.",
            "Step 4: Top it off with the other bread slice.",
            "Step 5: Cut the sandwich in half with your knife and enjoy!"];  // Default steps from Gemini

    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex(prev => (prev + 1) % steps.length);  // Loops through list of steps
        }, 10000);                                             // every 10 seconds.

        return () => clearInterval(interval);  // Cleanup when component unmounts (properly stops timer).
    }, []);

    const recipeStep = steps[stepIndex] || "Loading..."; // Text of current step.

    return (
        <>
            <div className={styles.main_div}>
                <div className={styles.sidebar_div}>
                    <SideBar />
                </div>

                <div className={styles.title_and_content_div}>
                    <div className={styles.titlebar_div}>
                        <TitleBar />
                    </div>
                    <div className={styles.page_div}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );

};