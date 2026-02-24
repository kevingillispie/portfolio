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
    };

    const codeSnippets = [
        // Modern React / hooks era
        "use client",
        "'use client'",
        "use server",
        "use",
        "useTransition",
        "useOptimistic",
        "useActionState",
        "useFormStatus",
        "startTransition",

        // Popular 2025-ish syntax & libs
        "clsx",
        "cn",
        "twMerge",
        "motion.div",
        "motion.span",
        "<motion.div",
        "animate",
        "initial",
        "whileInView",
        "viewport={{ once: true }}",
        "framer-motion",
        "shadcn/ui",
        "next-themes",
        "lucide-react",
        "cmdk",

        // Classic but still sexy
        "const",
        "let",
        "=>",
        "async",
        "await",
        "fetch",
        "Promise.all",
        "...",
        "??",
        "?.",
        "??=",
        "#private",

        // JSX & components
        "<div",
        "</div>",
        "<>",
        "</>",
        "{children}",
        "{...props}",
        "className=",
        "className={cn(",
        "type=",
        "variant=",
        "size=",

        // Meme / dev twitter energy
        "bruh",
        "wtf",
        "lmaooo",
        "skill issue",
        "works on my machine",
        "console.debug('pls')",
        "todo: fix later 💀",
        "// 🚀",
        "🤡",
        "¯\\_(ツ)_/¯",

        // Symbols & punctuation that look nice floating
        "{",
        "}",
        "(",
        ")",
        "[",
        "]",
        ":",
        ";",
        ",",
        "=",
        "===",
        "=>",
        "->",
        "??",
        "?.",
        "|>",
        "::",
        "//",
        "/* */",

        // Bonus one-liners / snippets
        "setTimeout(() =>",
        "setInterval(() =>",
        "useEffect(() => {",
        "return () => {",
        "ReactDOM.createRoot",
        "createRoot(document.getElementById('root'))",
        "<Suspense fallback={<Loading />} >",
    ];

    const options: ISourceOptions = useMemo(
        () => ({
            fullScreen: { enable: false, zIndex: -1 },
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            limit: 80,
            particles: {
                number: {
                    value: 100,
                    density: { enable: true, width: 1920, height: 1080 },
                },
                color: {
                    value: [
                        "#333",
                    ]
                },
                shape: {
                    type: "text",
                    options: {
                        text: {
                            value: codeSnippets,
                            font: "var(--font-geist-mono), GeistMono, monospace",
                            style: "",
                            weight: "normal",
                            size: 7,
                        },
                    },
                },
                size: {
                    value: { min: 8, max: 14 },
                },
                opacity: {
                    value: .5
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
                    onHover: { enable: true, mode: ["grab", "repulse"] },
                    resize: { enable: true, },
                },
                modes: {
                    grab: { distance: 160, links: { opacity: 0.6 } },
                    repulse: {
                        distance: 50,
                        duration: 0.4,
                        factor: 5,
                        speed: .5,
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
            className="absolute inset-0 select-none -z-10"
            style={{ width: "100%", height: "100%" }}
            particlesLoaded={particlesLoaded}
            options={options}
        />
    );
}