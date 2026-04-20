// CookingPage.jsx

import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './CookingPage.module.scss';
import { useGeminiLive } from "../GeminiLive/usingGemini";

function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function CookingPage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/recipes/${id}`)
            .then(res => res.json())
            .then(data => setRecipe(data))
            .catch(err => console.error('Failed to fetch recipe:', err));
    }, [id]);

    const { status, transcript, stepIndex, timer, connect, disconnect, goToStep } = useGeminiLive(recipe);

    const steps           = recipe?.steps ?? [];
    const totalSteps      = steps.length;
    const currentStep     = totalSteps > 0 ? steps[stepIndex] : null;
    const progressPercent = totalSteps > 0 ? ((stepIndex + 1) / totalSteps) * 100 : 0;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleBlock}>
                        <h1 className={styles.title}>{recipe?.recipe_name ?? 'Loading recipe...'}</h1>
                        <p className={styles.subtitle}>
                            {totalSteps > 0
                                ? `Step ${stepIndex + 1} of ${totalSteps}`
                                : 'Preparing cooking mode...'}
                        </p>
                    </div>

                    <div className={styles.headerActions}>
                        <button
                            type="button"
                            onClick={status === 'active' ? disconnect : connect}
                            className={styles.exitButton}
                        >
                            {status === 'idle'       && 'Start Assistant'}
                            {status === 'connecting' && 'Connecting...'}
                            {status === 'active'     && 'Stop Assistant'}
                            {status === 'error'      && 'Retry'}
                        </button>

                        <Link to={`/main/recipe/${id}`}>
                            <button type="button" onClick={disconnect} className={styles.exitButton}>
                                Exit Cooking Mode
                            </button>
                        </Link>
                    </div>
                </div>

                <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
                </div>

                <div className={styles.controls}>
                    <button
                        type="button"
                        onClick={() => goToStep(stepIndex - 1)}
                        disabled={stepIndex === 0 || totalSteps === 0}
                        className={`${styles.stepButton} ${styles.previousButton}`}
                    >
                        ← Previous Step
                    </button>
                    <button
                        type="button"
                        onClick={() => goToStep(stepIndex + 1)}
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
                    <div className={styles.assistantLabel}>
                        ASSISTANT {status === 'active' && '● LIVE'}
                    </div>
                    <div className={styles.assistantText}>
                        {transcript.model
                            ? transcript.model
                            : currentStep
                                ? `Step ${stepIndex + 1}: ${currentStep.instruction}`
                                : 'Start the assistant and say "go to the next step" or "start a timer for 5 minutes".'}
                    </div>
                    {transcript.user && (
                        <div className={styles.userTranscript}>
                            You said: "{transcript.user}"
                        </div>
                    )}
                </div>

                {timer > 0 && (
                    <div className={styles.timerCard}>
                        Timer: {formatDuration(timer)}
                    </div>
                )}

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