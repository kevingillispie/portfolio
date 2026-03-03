// LeftRuler.tsx
"use client";

import { useEffect, useRef } from "react";

export default function LeftRuler() {
    const rulerContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateDistances = () => {
            const container = rulerContainerRef.current;
            if (!container) return;

            // Query **inside** the function — safe every time
            const labels = container.querySelectorAll('span[data-ruler-label]') as NodeListOf<HTMLSpanElement>;
            if (labels.length === 0) return;

            const scrollY = window.scrollY;
            const containerRect = container.getBoundingClientRect();
            const rulerHeight = container.clientHeight;

            labels.forEach((label, i) => {
                const tickOffset = (i / (labels.length - 1)) * rulerHeight;
                const absoluteTop = window.scrollY + containerRect.top + tickOffset;
                const distance = Math.round(absoluteTop - scrollY);

                label.textContent = `${Math.max(0, distance).toLocaleString()} px`;

                if (distance <= 0) {
                    label.className = "text-zinc-500/40 line-through";
                } else if (distance < 300) {
                    label.className = "text-orange-400/90";
                } else {
                    label.className = "text-zinc-700 dark:text-zinc-200";
                }
            });
        };

        // Run once on mount
        updateDistances();

        window.addEventListener('scroll', updateDistances, { passive: true });
        window.addEventListener('resize', updateDistances);

        return () => {
            window.removeEventListener('scroll', updateDistances);
            window.removeEventListener('resize', updateDistances);
        };
    }, []); // still empty deps — fine now

    return (
        <div
            ref={rulerContainerRef}
            className="absolute left-4 xl:left-10 top-1/4 bottom-1/4 w-[1px] bg-zinc-400 dark:bg-white/20 flex flex-col justify-between items-start py-8"
        >
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-[1px] bg-zinc-400 dark:bg-white/60" />
                    <span data-ruler-label className="text-zinc-700 dark:text-zinc-200">
                        … px
                    </span>
                </div>
            ))}
        </div>
    );
}