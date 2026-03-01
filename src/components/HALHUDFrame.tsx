"use client";

import { useEffect, useRef } from "react";

export default function HALHUDFrame() {
    const hzRef = useRef<HTMLSpanElement>(null);
    const timestampRef = useRef<HTMLSpanElement>(null);

    // 1. Set formatted local SEQ_ID timestamp once on mount
    useEffect(() => {
        if (timestampRef.current) {
            const now = new Date();

            // Extract components manually for full control
            const year = now.getFullYear().toString();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');

            const numericStr = year + month + day + hours + minutes + seconds;
            const grouped = numericStr.match(/.{1,4}/g)?.join(':') || 'LOADING...';

            timestampRef.current.textContent = grouped;
        }
    }, []);

    // 2. Fluctuating SCAN_HZ around 60.00 (unchanged from previous)
    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();
        const base = 60.0;
        let noise = 0;
        let noiseVelocity = 0;

        const updateHz = (currentTime: number) => {
            const delta = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            noiseVelocity += (Math.random() - 0.5) * 0.08 * delta;
            noiseVelocity *= 0.92;
            noise += noiseVelocity * delta;
            noise = Math.max(-1.2, Math.min(1.2, noise));

            const value = base + noise + Math.sin(currentTime * 0.0007) * 0.25;
            const formatted = value.toFixed(2).padStart(5, " ");

            if (hzRef.current) {
                hzRef.current.textContent = formatted;
                const dev = Math.abs(value - 60);
                const opacity = Math.min(0.9, dev * 0.6);
                hzRef.current.style.opacity = dev > 0.4 ? `${0.5 + opacity}` : "1";
            }

            animationFrameId = requestAnimationFrame(updateHz);
        };

        animationFrameId = requestAnimationFrame(updateHz);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="absolute mt-8 inset-0 z-[1] pointer-events-none overflow-hidden font-mono text-[10px] uppercase tracking-widest text-white/40 min-h-screen">

            {/* Left Ruler */}
            <div className="absolute left-10 top-1/4 bottom-1/4 w-[1px] bg-zinc-400 dark:bg-white/20 flex flex-col justify-between items-start py-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-[1px] bg-zinc-400 dark:bg-white/60" />
                        <span className="hidden md:block text-zinc-700 dark:text-zinc-200">MEM_0{i * 2}: DEFRAG</span>
                    </div>
                ))}
            </div>

            {/* Top Navigation Bar */}
            <div className="absolute top-10 left-16 right-16 flex justify-between border-t border-zinc-400 dark:border-white/20 pt-3">
                <div className="flex gap-10">
                    <span className="text-red-500/80 font-bold tracking-normal">● LIVE_STREAM</span>
                    <span className="text-zinc-700 dark:text-zinc-200">SYS_CORE: 04</span>
                </div>
                <div className="flex gap-10 text-zinc-700 dark:text-zinc-200">
                    <span>
                        SCAN_HZ: <span ref={hzRef} id="hz-rate" className="text-green-500">60.00</span>
                    </span>
                    <span>
                        BUFFER: <span className="text-yellow-500">OVERFLOW</span>
                    </span>
                </div>
            </div>

            {/* Corner Brackets */}
            <div className="absolute top-10 left-10 w-6 h-8 border-t border-l border-zinc-400 dark:border-white/20" />
            <div className="absolute top-10 right-10 w-6 h-8 border-t border-r border-zinc-400 dark:border-white/20" />
            <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-zinc-400 dark:border-white/20" />
            <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-zinc-400 dark:border-white/20" />

            {/* Bottom Right Data Block */}
            <div className="absolute bottom-13 right-16 text-right leading-tight text-zinc-700 dark:text-zinc-200">
                <p>LN_PROC: 0x44F2</p>
                <p>SEQ_ID: <span ref={timestampRef} id="timestamp">LOADING...</span></p>
            </div>
        </div>
    );
}