import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './CookingPage.module.scss';

export default function CookingPage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}`)
            .then(res => res.json())
            .then(data => {
                setRecipe(data);
                setStepIndex(0);
            })
            .catch(err => console.error('Failed to fetch recipe for cooking mode:', err));
    }, [id]);

    const steps = recipe?.steps ?? [];
    const totalSteps = steps.length;
    const currentStep = totalSteps > 0 ? steps[stepIndex] : null;
    const progressPercent = totalSteps > 0 ? ((stepIndex + 1) / totalSteps) * 100 : 0;

    function goToPreviousStep() {
        setStepIndex(prev => Math.max(prev - 1, 0));
    }

    function goToNextStep() {
        setStepIndex(prev => Math.min(prev + 1, totalSteps - 1));
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleBlock}>
                        <h1 className={styles.title}>{recipe?.recipe_name ?? 'Loading recipe...'}</h1>
                        <p className={styles.subtitle}>
                            {totalSteps > 0 ? `Step ${stepIndex + 1} of ${totalSteps}` : 'Preparing cooking mode...'}
                        </p>
                    </div>

                    <Link to={`/main/recipe/${id}`} className={styles.exitLink}>
                        <button type="button" className={styles.exitButton}>
                            Exit Cooking Mode
                        </button>
                    </Link>
                </div>

                <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
                </div>

                <div className={styles.controls}>
                    <button
                        type="button"
                        onClick={goToPreviousStep}
                        disabled={stepIndex === 0 || totalSteps === 0}
                        className={`${styles.stepButton} ${styles.previousButton}`}
                    >
                        ← Previous Step
                    </button>

                    <button
                        type="button"
                        onClick={goToNextStep}
                        disabled={totalSteps === 0 || stepIndex === totalSteps - 1}
                        className={`${styles.stepButton} ${styles.nextButton}`}
                    >
                        Next Step →
                    </button>
                </div>

                <div className={styles.stepCard}>
                    <div className={styles.stepLabel}>
                        {totalSteps > 0 ? `STEP ${stepIndex + 1}` : 'COOKING'}
                    </div>

                    <div className={styles.stepInstructionWrapper}>
                        <div className={styles.stepInstruction}>
                            {currentStep?.instruction ?? 'Loading your step instructions...'}
                        </div>
                    </div>
                </div>

                <div className={styles.assistantCard}>
                    <div className={styles.assistantLabel}>ASSISTANT</div>
                    <div className={styles.assistantText}>
                        {currentStep
                            ? `Step ${stepIndex + 1}: ${currentStep.instruction}`
                            : 'Preparing your guided cooking experience...'}
                    </div>
                </div>

                <details className={styles.ingredientsDetails}>
                    <summary className={styles.ingredientsSummary}>Ingredients reference</summary>
                    <ul className={styles.ingredientsList}>
                        {(recipe?.ingredients ?? []).map((ingredient, index) => (
                            <li key={`${ingredient.ingredient_name}-${index}`}>
                                {ingredient.quantity} {ingredient.unit_name} {ingredient.ingredient_name}
                            </li>
                        ))}
                    </ul>
                </details>
            </div>
        </div>
    );
}