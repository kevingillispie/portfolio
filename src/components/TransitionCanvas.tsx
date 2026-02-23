"use client";

import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadTextShape } from "@tsparticles/shape-text";
import type { ISourceOptions } from "@tsparticles/engine";

export default function TransitionCanvas() {
    const [init, setInit] = useState(false);
    const [coords, setCoords] = useState<{ x: number, y: number } | null>(null);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
            await loadTextShape(engine);
        }).then(() => setInit(true));

        const handleTrigger = (e: any) => {
            setCoords({ x: e.detail.x, y: e.detail.y });
            // Auto-clear after the animation
            setTimeout(() => setCoords(null), 1500);
        };

        window.addEventListener("trigger-explosion", handleTrigger);
        return () => window.removeEventListener("trigger-explosion", handleTrigger);
    }, []);

    const options: ISourceOptions = useMemo(() => ({
        fullScreen: { enable: false },
        fpsLimit: 120,
        particles: {
            number: { value: 0 }, // Start with none
            color: { value: "#ffffff" },
            shape: {
                type: "text",
                options: { text: { value: ["{", "}", "=>", "const"] } }
            },
            opacity: { value: 1 },
            size: { value: { min: 10, max: 25 } },
            move: {
                enable: true,
                speed: { min: 10, max: 25 },
                direction: "none",
                outModes: "destroy"
            }
        },
        // This makes particles spawn at the click
        emitters: coords ? {
            position: { x: (coords.x / window.innerWidth) * 100, y: (coords.y / window.innerHeight) * 100 },
            rate: { quantity: 30, delay: 0 },
            life: { duration: 0.1, count: 1 }
        } : []
    }), [coords]);

    if (!init || !coords) return null;

    return (
        <div className="fixed inset-0 z-[10000] pointer-events-none">
            <Particles id="explosion-canvas" options={options} className="h-full w-full" />
        </div>
    );
}