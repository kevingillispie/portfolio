"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export default function ParticlesBackground() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine); // bubble mode is in slim
        }).then(() => setInit(true));
    }, []);


    const options: ISourceOptions = useMemo(
        () => ({
            fullScreen: { enable: false, zIndex: -1 },
            background: { color: { value: "transparent" } },
            backgroundMask: {
                enable: true,
                cover: {
                    color: {
                        value: {
                            r: 0,
                            g: 0,
                            b: 0
                        }
                    }
                }
            },
            fpsLimit: 60,
            particles: {
                number: {
                    value: 500,
                    density: { enable: true, width: 1920, height: 1080 },
                },
                color: { value: "#333" },
                shape: { type: "circle" },
                size: {
                    value: { min: 4, max: 8 },
                    animation: {
                        enable: true,
                        speed: 20,
                        minimumValue: 4,
                        sync: false,
                    },
                },
                opacity: {
                    value: 0.5,
                    animation: {
                        enable: true,
                        speed: 1,
                        minimumValue: 0.3,
                        sync: false,
                    },
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
                    speed: 0.7, // your slow motion
                    direction: "none",
                    random: true,
                    straight: false,
                    attract: { enable: true, rotateX: 300, rotateY: 600 },
                    outModes: { default: "bounce" },
                },
            },
            interactivity: {
                detectsOn: "window",
                events: {
                    onHover: {
                        enable: true,
                        mode: "bubble",
                        parallax: {
                            enable: false,
                            force: 60,
                            smooth: 10
                        },
                        onClick: {
                            enable: true,
                            mode: "push"
                        },
                    },
                    resize: true,
                },
                modes: {
                    grab: {
                        distance: 400,
                        lineLinked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 55,
                        duration: 2,
                        opacity: 0.9,
                        color: "#60a5fa",
                    },
                    repulse: {
                        distance: 200
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
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
            className="absolute inset-0 -z-10"
            options={options}
        />
    );
}