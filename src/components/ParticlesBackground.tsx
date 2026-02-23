"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadTextShape } from "@tsparticles/shape-text";
import { loadEmittersPlugin } from "@tsparticles/plugin-emitters";
import type { Container, ISourceOptions } from "@tsparticles/engine";

export default function ParticlesBackground() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            console.log("Checking Emitter Plugin:", loadEmittersPlugin);
            await loadSlim(engine);
            await loadTextShape(engine);

            if (loadEmittersPlugin) {
                await loadEmittersPlugin(engine);
            } else {
                console.error("Critical: loadEmittersPlugin is undefined. Check your install.");
            }
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (container?: Container) => {
        (window as any).particlesContainer = container;
        console.log("Does addEmitter exist?", typeof (container as any).addEmitter);
    };

    const codeSnippets = [
        "<div>",
        "</div>",
        "<h1>",
        "</h1>",
        "className=",
        "onClick=",
        "alt=",
        "{",
        "}",
        "=>",
        "const",
        "let",
        "function",
        "i=0",
        "import",
        "while",
        "<img",
        "</>",
        "useState",
        "useEffect",
        "console.log"
    ];

    const options: ISourceOptions = useMemo(
        () => ({
            fullScreen: { enable: false, zIndex: -1 },
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            limit: 80,
            particles: {
                number: {
                    value: 50,
                    density: { enable: true, width: 1920, height: 1080 },
                },
                color: { value: ["#60a5fa", "#a78bfa", "#f472b6", "#34d399"] },
                shape: {
                    type: "text",
                    options: {
                        text: {
                            value: codeSnippets,
                            font: "var(--font-geist-mono), GeistMono, monospace",
                            style: "",
                            weight: "normal",
                            size: 12,
                        },
                    },
                },
                size: {
                    value: { min: 8, max: 18 },
                },
                opacity: {
                    value: { min: 0.4, max: 0.75 },
                },
                links: {
                    enable: true,
                    distance: 500,
                    color: "#60a5fa",
                    opacity: 0.2,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: 0.7,
                    direction: "none",
                    random: true,
                    straight: false,
                    attract: { enable: true, rotateX: 300, rotateY: 600 },
                    outModes: { default: "bounce" },
                },
                rotate: {
                    value: { min: -15, max: 15 },
                    animation: { enable: true, speed: 2, sync: false },
                    direction: "random",
                },
            },
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "grab" },
                    onClick: { enable: true, mode: "push" },
                    resize: { enable: true, },
                },
                modes: {
                    grab: { distance: 160, links: { opacity: 0.6 } },
                    repulse: {
                        distance: 100,
                        duration: 0.4,
                        factor: 100,
                        speed: 1,
                        maxSpeed: 50
                    },
                    push: { quantity: 3 },
                },
            },
            detectRetina: true,
            pauseOnOutsideViewport: true,
        }),
        []
    );

    if (!init) return null;

    return (
        <Particles
            id="tsparticles-code"
            className="absolute inset-0 select-none -z-10" // Back to background
            particlesLoaded={particlesLoaded}
            options={options}
        />
    );
}