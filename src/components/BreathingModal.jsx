import React, { useState, useEffect, useRef, useCallback } from 'react';

const EXERCISES = {
    box: {
        name: 'Box Breathing',
        subtitle: 'Focus & Clarity',
        phases: [
            { label: 'Inhale', duration: 4000 },
            { label: 'Hold', duration: 4000 },
            { label: 'Exhale', duration: 4000 },
            { label: 'Hold', duration: 4000 },
        ],
    },
    calm: {
        name: '4-7-8 Breathing',
        subtitle: 'Calm & Release',
        phases: [
            { label: 'Inhale', duration: 4000 },
            { label: 'Hold', duration: 7000 },
            { label: 'Exhale', duration: 8000 },
        ],
    },
};

const TOTAL_CYCLES = 5;

export default function BreathingModal({ isOpen, onClose }) {
    const [mode, setMode] = useState('box');
    const [isActive, setIsActive] = useState(false);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [currentCycle, setCurrentCycle] = useState(1);
    const [isComplete, setIsComplete] = useState(false);
    const [progress, setProgress] = useState(0); // 0..1 within current phase

    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const rafRef = useRef(null);

    const exercise = EXERCISES[mode];
    const currentPhase = exercise.phases[currentPhaseIndex];

    // Clean up all timers
    const clearAllTimers = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        timerRef.current = null;
        rafRef.current = null;
    }, []);

    // Reset everything
    const resetExercise = useCallback(() => {
        clearAllTimers();
        setIsActive(false);
        setCurrentPhaseIndex(0);
        setCurrentCycle(1);
        setIsComplete(false);
        setProgress(0);
    }, [clearAllTimers]);

    // Animation frame loop for smooth progress
    const animateProgress = useCallback((duration) => {
        startTimeRef.current = performance.now();

        const tick = (now) => {
            const elapsed = now - startTimeRef.current;
            const p = Math.min(elapsed / duration, 1);
            setProgress(p);

            if (p < 1) {
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
    }, []);

    // Advance to next phase
    const advancePhase = useCallback(() => {
        const phases = EXERCISES[mode].phases;
        const nextPhaseIndex = currentPhaseIndex + 1;

        if (nextPhaseIndex >= phases.length) {
            // End of cycle
            const nextCycle = currentCycle + 1;
            if (nextCycle > TOTAL_CYCLES) {
                // Exercise complete
                clearAllTimers();
                setIsComplete(true);
                setIsActive(false);
                return;
            }
            setCurrentCycle(nextCycle);
            setCurrentPhaseIndex(0);
        } else {
            setCurrentPhaseIndex(nextPhaseIndex);
        }
        setProgress(0);
    }, [mode, currentPhaseIndex, currentCycle, clearAllTimers]);

    // Run phase timer when active & phase changes
    useEffect(() => {
        if (!isActive || isComplete) return;

        const phases = EXERCISES[mode].phases;
        const phase = phases[currentPhaseIndex];
        if (!phase) return;

        animateProgress(phase.duration);
        timerRef.current = setTimeout(advancePhase, phase.duration);

        return () => clearAllTimers();
    }, [isActive, currentPhaseIndex, currentCycle, mode, isComplete, animateProgress, advancePhase, clearAllTimers]);

    // Handle mode switch — fully reset
    const handleModeSwitch = (newMode) => {
        resetExercise();
        setMode(newMode);
    };

    // Start exercise
    const handleStart = () => {
        setIsComplete(false);
        setCurrentPhaseIndex(0);
        setCurrentCycle(1);
        setProgress(0);
        setIsActive(true);
    };

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                resetExercise();
                onClose();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose, resetExercise]);

    // Cleanup on unmount or close
    useEffect(() => {
        if (!isOpen) resetExercise();
    }, [isOpen, resetExercise]);

    if (!isOpen) return null;

    // Circle scale: inhale = grow, exhale = shrink, hold = stay
    const getCircleScale = () => {
        if (!isActive && !isComplete) return 0.6;

        const label = currentPhase?.label;
        if (label === 'Inhale') return 0.6 + 0.4 * progress;
        if (label === 'Exhale') return 1.0 - 0.4 * progress;
        // Hold
        const prevPhaseLabel = currentPhaseIndex > 0
            ? exercise.phases[currentPhaseIndex - 1].label
            : exercise.phases[exercise.phases.length - 1].label;
        return prevPhaseLabel === 'Inhale' || prevPhaseLabel === 'Hold' ? 1.0 : 0.6;
    };

    const circleScale = getCircleScale();

    return (
        <div className="fixed inset-0 bg-sanctuary-linen z-[70] flex flex-col items-center justify-center transition-all duration-500">
            {/* Close button */}
            <button
                onClick={() => { resetExercise(); onClose(); }}
                className="absolute top-6 right-6 text-xs tracking-widest uppercase opacity-30 hover:opacity-80 transition-opacity focus:outline-none z-10"
            >
                ✕
            </button>

            {/* Mode tabs */}
            {!isActive && !isComplete && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-8">
                    {Object.entries(EXERCISES).map(([key, ex]) => (
                        <button
                            key={key}
                            onClick={() => handleModeSwitch(key)}
                            className={`text-[10px] tracking-[0.2em] uppercase transition-all duration-300 focus:outline-none pb-1 border-b ${
                                mode === key
                                    ? 'opacity-80 border-sanctuary-sage'
                                    : 'opacity-30 border-transparent hover:opacity-60'
                            }`}
                        >
                            {ex.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Breathing circle */}
            <div className="relative flex items-center justify-center" style={{ width: '220px', height: '220px' }}>
                <div
                    className="rounded-full border border-sanctuary-sage border-opacity-30 transition-none"
                    style={{
                        width: '200px',
                        height: '200px',
                        transform: `scale(${circleScale})`,
                        background: `radial-gradient(circle, rgba(138,154,134,0.06) 0%, rgba(138,154,134,0.02) 100%)`,
                        transition: isActive ? 'none' : 'transform 0.6s ease-in-out',
                    }}
                />
                {/* Inner dot */}
                <div
                    className="absolute w-2 h-2 rounded-full bg-sanctuary-sage"
                    style={{ opacity: isActive ? 0.6 : 0.2 }}
                />
            </div>

            {/* Phase label */}
            <div className="mt-10 h-12 flex flex-col items-center justify-center">
                {isComplete ? (
                    <>
                        <p className="font-heading text-2xl text-sanctuary-ink opacity-70">
                            Stillness achieved.
                        </p>
                        <p className="text-[10px] tracking-widest uppercase opacity-40 mt-2">
                            Return when you need this space again.
                        </p>
                    </>
                ) : isActive ? (
                    <>
                        <p className="font-heading text-2xl text-sanctuary-ink opacity-70 transition-opacity duration-300">
                            {currentPhase.label}
                        </p>
                        <p className="text-[10px] tracking-widest uppercase opacity-30 mt-2">
                            Cycle {currentCycle} of {TOTAL_CYCLES}
                        </p>
                    </>
                ) : (
                    <>
                        <p className="font-heading text-xl text-sanctuary-ink opacity-50">
                            {exercise.subtitle}
                        </p>
                        <p className="text-[10px] tracking-widest uppercase opacity-30 mt-2">
                            {TOTAL_CYCLES} cycles • {mode === 'box' ? '~80 seconds' : '~95 seconds'}
                        </p>
                    </>
                )}
            </div>

            {/* Start / Return buttons */}
            <div className="mt-10">
                {isComplete ? (
                    <button
                        onClick={() => { resetExercise(); onClose(); }}
                        className="px-8 py-2.5 border border-sanctuary-stone text-[10px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 hover:bg-sanctuary-sage hover:text-sanctuary-linen hover:border-sanctuary-sage transition-all duration-300 focus:outline-none"
                    >
                        Return to Sanctuary
                    </button>
                ) : !isActive ? (
                    <button
                        onClick={handleStart}
                        className="px-8 py-2.5 border border-sanctuary-stone text-[10px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 hover:bg-sanctuary-sage hover:text-sanctuary-linen hover:border-sanctuary-sage transition-all duration-300 focus:outline-none"
                    >
                        Begin
                    </button>
                ) : null}
            </div>
        </div>
    );
}
