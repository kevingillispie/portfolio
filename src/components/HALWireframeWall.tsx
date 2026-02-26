"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function HALWireframeWall({ rows = 6, cols = 14 }) {
    const wallRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const width = 30;
    const height = 90;
    const depth = 180;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const halfDepth = depth / 2;

    useEffect(() => {
        if (!wallRef.current || !containerRef.current) return;

        const modules = Array.from(wallRef.current.querySelectorAll(".memory-module"));
        const activeIndices = new Set<number>();

        // 1. THE INTRO
        animate(modules, {
            translateY: [600, 0],
            rotateX: [45, 0],
            opacity: [0, 1],
            delay: (el, i) => i * 15,
            duration: 2000,
            easing: "easeOutQuart"
        });

        animate(containerRef.current, {
            perspectiveOrigin: ["10% 150%", "60% 100%"], // Adjusted to look better at the top
            duration: 2500,
            easing: "easeOutQuart"
        });

        // 2. THE LOOP
        const triggerRandomModule = () => {
            if (activeIndices.size >= 5) return;
            let randomIndex = Math.floor(Math.random() * modules.length);
            if (activeIndices.has(randomIndex)) return;

            activeIndices.add(randomIndex);
            const targetModule = modules[randomIndex];
            const frontFace = targetModule.querySelector(".front-face");

            animate(targetModule, {
                translateZ: [0, 50, 0],
                duration: 3000,
                easing: "easeInOutQuart",
                onComplete: () => activeIndices.delete(randomIndex),
            });

            animate(frontFace, {
                backgroundColor: ["rgba(252, 165, 165, 0.6)", "rgba(255, 255, 255, 1)", "rgba(252, 165, 165, 0.6)"],
                borderColor: ["rgba(0, 0, 0, 0.6)", "rgba(255, 255, 255, 1)", "rgba(0, 0, 0, 0.6)"],
                duration: 3000,
                easing: "easeInOutQuart"
            });
        };

        const interval = setInterval(triggerRandomModule, 800);
        return () => clearInterval(interval);
    }, [rows, cols]);

    const wireframeStyle = "absolute border border-black/30 bg-red-300/60 transition-colors duration-500";

    return (
        /* Changed to absolute and items-start to sit at the top of the parent */
        <div className="mask-custom absolute inset-x-0 top-0 -z-1 flex items-start justify-center pointer-events-none overflow-hidden h-[800px]">
            <div
                ref={containerRef}
                className="mt-[-20px]" // Pulls the center of the 3D grid upward
                style={{ perspective: "1500px", perspectiveOrigin: "60% 110%" }}
            >
                <div
                    ref={wallRef}
                    className="relative grid gap-x-6 gap-y-2"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, ${width}px)`,
                        transform: "rotateY(18deg) rotateX(15deg) translateX(40px) translateZ(-100px)",
                        transformStyle: "preserve-3d",
                    }}
                >
                    {Array.from({ length: rows * cols }).map((_, i) => (
                        <div
                            key={i}
                            className="memory-module relative will-change-transform"
                            style={{
                                width: width,
                                height: height,
                                transformStyle: "preserve-3d",
                                opacity: 0,
                            }}
                        >
                            <div className={`${wireframeStyle} front-face inset-0 border-black/60`} style={{ transform: `translateZ(${halfDepth}px)`, transformStyle: "preserve-3d" }}>
                                <div className="absolute inset-x-0 top-2 h-[1px] bg-black/20" />
                                <div className="absolute inset-x-0 bottom-2 h-[1px] bg-black/20" />
                            </div>
                            <div className={wireframeStyle} style={{ width: depth, height: height, left: halfWidth - halfDepth, transform: `rotateY(90deg) translateZ(${halfWidth}px)` }} />
                            <div className={wireframeStyle} style={{ width: depth, height: height, left: halfWidth - halfDepth, transform: `rotateY(90deg) translateZ(-${halfWidth}px)` }} />
                            <div className={wireframeStyle} style={{ width: width, height: depth, top: halfHeight - halfDepth, transform: `rotateX(90deg) translateZ(${halfHeight}px)` }} />
                            <div className={wireframeStyle} style={{ width: width, height: depth, top: halfHeight - halfDepth, transform: `rotateX(90deg) translateZ(-${halfHeight}px)` }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}