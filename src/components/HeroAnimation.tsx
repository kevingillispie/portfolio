// src/components/HeroAnimation.tsx
'use client';

import { useEffect } from 'react';
import { createTimeline } from 'animejs';
import { Badge } from './ui/badge';
import 'src/app/hero.css';

export default function HeroAnimation() {
    useEffect(() => {

        // ─── Diamond flares ────────────────────────────────────────
        createTimeline()
            .add('.diamond-flare:nth-of-type(3)', {
                translateX: ['-100vw', '0vw'],
                ease: 'outExpo',
                duration: 2000,
            })
            .add('.diamond-flare:nth-of-type(1)', {
                opacity: [0, 1],
                translateX: ['42%', '0%'],
                ease: 'outExpo',
                duration: 2000,
            }, '-=1000');

        createTimeline()
            .add('.diamond-flare:nth-of-type(2)', {
                translateX: ['100vw', '0vw'],
                ease: 'outExpo',
                duration: 2000,
            })
            .add('.diamond-flare:nth-of-type(4)', {
                opacity: [0, 1],
                translateX: ['-42%', '0%'],
                ease: 'outExpo',
                duration: 2000,
            }, '-=1000');

        // ─── Wallpaper squares ─────────────────────────────────────
        createTimeline()
            .add('.wallpaper .square5', {
                translateX: ['-100vw', '0vw'],
                ease: 'outExpo',
                duration: 2000,
            })
            .add('.wallpaper .square3', {
                translateX: ['-100vw', '0vw'],
                ease: 'outExpo',
                duration: 1500,
            }, '-=1400')
            .add('.wallpaper .square1', {
                translateX: ['-100vw', '0vw'],
                ease: 'outExpo',
                duration: 1000,
            }, '-=1200');

        createTimeline()
            .add('.wallpaper .square6', {
                translateX: ['100vw', '0vw'],
                ease: 'outExpo',
                duration: 2000,
            })
            .add('.wallpaper .square4', {
                translateX: ['100vw', '0vw'],
                ease: 'outExpo',
                duration: 1500,
            }, '-=1350')
            .add('.wallpaper .square2', {
                translateX: ['100vw', '0vw'],
                ease: 'outExpo',
                duration: 1000,
            }, '-=1200')
            .add('.monitor-chassis', {
                boxShadow: [
                    '0 -10px calc(10px * var(--m)) rgba(173, 216, 230, .5)',
                    '0 -50px calc(30px * var(--m)) rgba(255, 255, 255, .8)',
                ],
                ease: 'outExpo',
                duration: 3000
            }, '-=1500')
            .add('.flare-left, .flare-right', {
                opacity: [0, 1],
                ease: 'outExpo',
                duration: 3000
            }, '-=1500')

            // ─── Text ──────────────────────────────────────────────────
            .add('.glass', {
                complete: () => {
                    setTimeout(() => {
                        document.querySelector('.glass').classList.toggle('frosted');
                    }, 2000);
                }
            });
    }, []);

    return (
        <div>
            <div className="absolute z-[9999] left-1/2 -translate-x-1/2 text-center mt-30 py-12 md:py-16 lg:py-20">
                <Badge variant="secondary" className="mb-6 py-1 shadow-lg bg-background/60 backdrop-blur-sm">Code & Content Creator</Badge>
                <h1 className="text-zinc-900 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-shadow-lg text-shadow-[rgba(255,255,255,.3)]">
                    Kevin Gillispie
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto">
                    Full-Stack Web Development • Cyber Security <br /> WP Plugins • Browser Extensions
                </p>
                <p className="mt-6 text-lg max-w-2xl mx-auto">
                    Building performant, user-focused tools <br />and sites that solve real problems.
                </p>
            </div>
            <div className="computer-container bg-gradient-to-r from-slate-900 via-slate-500 to-slate-900">
                <div className="diamond-flare">
                    <div className="left1 rounded-xl"></div>
                </div>
                <div className="diamond-flare">
                    <div className="right1"></div>
                </div>
                <div className="diamond-flare">
                    <div className="left2"></div>
                </div>
                <div className="diamond-flare">
                    <div className="right2 rounded-xl"></div>
                </div>
                <div className="computer-elements">
                    <div className="computer-screen">
                        <div className="monitor-chassis">
                            <div className="monitor-frame">
                                <div className="flare-left"></div>
                                <div className="glass">
                                    <div className="wallpaper">
                                        <div className="square1">
                                            <div></div>
                                        </div>
                                        <div className="square2">
                                            <div></div>
                                        </div>
                                        <div className="square3">
                                            <div></div>
                                        </div>
                                        <div className="square4">
                                            <div></div>
                                        </div>
                                        <div className="square5">
                                            <div></div>
                                        </div>
                                        <div className="square6">
                                            <div></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flare-right"></div>
                            </div>
                        </div>
                    </div>
                    <div className="finger-notch"></div>
                    <div className="keyboard-chassis"></div>
                    <div className="computer-bottom"></div>
                </div>
            </div>
        </div>
    );
}