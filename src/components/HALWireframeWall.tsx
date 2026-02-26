"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function HALWireframeWall({ rows = 4, cols = 14 }) {
    const wallRef = useRef<HTMLDivElement>(null);
    const width = 30;
    const height = 90;
    const depth = 180;

    useEffect(() => {
        if (!wallRef.current) return;
        const modules = Array.from(wallRef.current.querySelectorAll(".memory-module"));
        const activeIndices = new Set<number>();

        const triggerRandomModule = () => {
            if (activeIndices.size >= 5) return;
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * modules.length);
            } while (activeIndices.has(randomIndex));

            activeIndices.add(randomIndex);
            animate(modules[randomIndex], {
                translateZ: [0, 80, 0],
                duration: 2500,
                easing: "easeInOutQuart",
                onComplete: () => activeIndices.delete(randomIndex),
            });
        };

        const interval = setInterval(() => {
            if (Math.random() > 0.3) triggerRandomModule();
        }, 600);

        return () => clearInterval(interval);
    }, [rows, cols]);

    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const halfDepth = depth / 2;

    // Smooth transition for color changes
    const wireframeStyle = "absolute border border-black/30 bg-red-300/60 transition-colors duration-500";

    return (
        <div className="mask-custom fixed inset-0 -z-1 flex items-center justify-center pointer-events-none">
            <div style={{ perspective: "1400px" }}>
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
                            className="memory-module group relative pointer-events-auto cursor-none"
                            style={{
                                width: width,
                                height: height,
                                transformStyle: "preserve-3d",
                            }}
                        >
                            <div
                                className={`${wireframeStyle} inset-0 border-black/60 group-hover:bg-red-500/90 group-hover:border-white/40`}
                                style={{ transform: `translateZ(${halfDepth}px)` }}
                            >
                                <div className="absolute inset-x-0 top-2 h-[1px] bg-black/10" />
                                <div className="absolute inset-x-0 bottom-2 h-[1px] bg-black/10" />
                            </div>

                            {/* Sides */}
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