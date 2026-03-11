'use client';

import React, { useEffect, useState } from 'react';

export const ReadingProgressBar = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const currentProgress = window.scrollY;
            // Target the actual article height for better precision
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                // Ensure we clamp between 0 and 100
                const p = Math.min(100, Math.max(0, (currentProgress / scrollHeight) * 100));
                setProgress(p);
            }
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    // Color Logic:
    // Orange is ~30, Green is ~120. 
    // We can use a power function (Math.pow) to make the transition non-linear.
    // An exponent > 1 will stay Orange longer.
    const transitionFactor = Math.pow(progress / 100, 1.5);
    const currentHue = 30 + (120 - 30) * transitionFactor;

    // We slightly lower the lightness in the "Yellow" phase (mid-scroll) 
    // to keep it from looking too "neon"
    const lightness = 45 - (Math.sin(Math.PI * (progress / 100)) * 5);

    return (
        <div className="fixed top-0 left-0 w-full h-1.5 z-[100] bg-transparent pointer-events-none">
            <div
                className="h-full transition-all duration-300 ease-out shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                style={{
                    width: `${progress}%`,
                    backgroundColor: `hsl(${currentHue}, 80%, ${lightness}%)`
                }}
            />
        </div>
    );
};