"use client";

import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadTextShape } from "@tsparticles/shape-text";
import { loadEmittersPlugin } from "@tsparticles/plugin-emitters";
import type { ISourceOptions } from "@tsparticles/engine";

export default function TransitionCanvas() {
    const [init, setInit] = useState(false);
    const [coords, setCoords] = useState<{ x: number, y: number } | null>(null);
    const [isEnabled, setIsEnabled] = useState(true);

    useEffect(() => {
        // Sync with localStorage on mount
        const saved = localStorage.getItem("particles-enabled");
        setIsEnabled(saved !== "false");

        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
            await loadTextShape(engine);
            await loadEmittersPlugin(engine);
        }).then(() => setInit(true));

        const handleToggle = (e: any) => {
            setIsEnabled(e.detail);
        };

        const handleTrigger = (e: any) => {
            // Read from state or localStorage
            const currentlyEnabled = localStorage.getItem("particles-enabled") !== "false";
            if (!currentlyEnabled) return;

            setCoords({ x: e.detail.x, y: e.detail.y });
            setTimeout(() => setCoords(null), 3500);
        };

        window.addEventListener("trigger-explosion", handleTrigger);
        window.addEventListener("toggle-particles", handleToggle); // Listen for the toggle

        return () => {
            window.removeEventListener("trigger-explosion", handleTrigger);
            window.removeEventListener("toggle-particles", handleToggle);
        };
    }, []);

    const particles = ["<a", "href", "https", "://", "target", "rel", "class", "=", "\"", "/>"];

    const options: ISourceOptions = useMemo(() => ({
        fullScreen: { enable: false },
        fpsLimit: 120,
        particles: {
            number: { value: 0 },
            color: { value: ["#0056B3", "#333"] },
            shape: {
                type: "text",
                options: { text: { value: particles } }
            },
            opacity: {
                value: { min: 0, max: 1 },
                animation: {
                    enable: true,
                    speed: 1,
                    startValue: "max",
                    destroy: "min",
                    sync: false
                }
            },
            size: { value: { min: 6, max: 8 } },
            move: {
                enable: true,
                speed: { min: 30, max: 50 },
                direction: "none",
                random: false,
                straight: false,
                outModes: {
                    default: "destroy",
                    bottom: "bounce"
                },
                gravity: {
                    enable: true,
                    acceleration: 75,
                    maxSpeed: 100
                },
                // This simulates energy loss on hit
                bounce: {
                    horizontal: { value: .03 },
                    vertical: { value: 1 }
                },
                // Friction stops the sliding after the bounce
                drift: .1,
                decay: 0.04, // A very small decay helps simulate air resistance without freezing
            },
        },
        emitters: coords ? {
            position: {
                x: (coords.x / window.innerWidth) * 100,
                y: (coords.y / window.innerHeight) * 100
            },
            rate: { quantity: 2, delay: 0 },
            life: { duration: 0.1, count: 1 }
        } : []
    }), [coords]);

    // Optimization: If disabled and no active coords, don't render the canvas component
    if (!init || (!isEnabled && !coords)) return null;

    return (
        <div className="fixed inset-0 z-[10000] pointer-events-none">
            <Particles id="explosion-canvas" options={options} className="h-full w-full" />
        </div>
    );
}