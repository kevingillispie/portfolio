// src/app/layout.tsx
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import SkipLink from "@/components/SkipLink";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import SettingsMenu from "@/components/SettingsMenu";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import TransitionCanvas from "@/components/TransitionCanvas";
import { Toaster } from "@/components/ui/sonner";
import HALHUDFrame from "@/components/HALHUDFrame";

import "./globals.css";

const metaDescription =
    "Full-stack web developer specializing in Next.js, TypeScript, Tailwind, shadcn/ui. Building performant SEO plugins, browser security tools, and modern sites.";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kevingillispie.com"),

    title: {
        default: "Kevin Gillispie – Full-Stack Web Developer",
        template: "%s | Kevin Gillispie",
    },

    description: metaDescription,

    keywords: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "shadcn/ui",
        "web developer",
        "portfolio",
        "SEO plugins",
        "browser extensions",
    ],
    authors: [{ name: "Kevin Gillispie", url: "https://kevingillispie.com" }],
    creator: "Kevin Gillispie",

    openGraph: {
        title: "Kevin Gillispie – Full-Stack Web Developer",
        description: metaDescription,
        url: "https://kevingillispie.com",
        siteName: "Kevin Gillispie",
        images: [
            {
                url: "/opengraph-image.png",
                width: 1200,
                height: 630,
                alt: "Kevin Gillispie - Full-Stack Web Developer",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Kevin Gillispie – Full-Stack Web Developer",
        description: "Building performant tools, SEO plugins, browser extensions, and modern websites.",
        images: ["/opengraph-image.png"],
        creator: "@kevinlgillispie",
    },

    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
            <body
                className={`
                    text-foreground dark:text-zinc-300
                    min-h-screen flex flex-col bg-gradient-to-br from-zinc-300 via-zinc-50 to-zinc-200 
                    dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 antialiased
                `}
            >
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <TransitionCanvas />
                    <SkipLink />
                    <LoadingScreen>
                        <div className="relative z-10 flex flex-col min-h-screen">
                            <HALHUDFrame />
                            <Navbar />
                            <SettingsMenu />

                            <main id="main-content" className="flex-1">{children}</main>

                            <Footer />
                        </div>
                    </LoadingScreen>
                    <Toaster position="top-right" richColors closeButton duration={5000} />
                </ThemeProvider>

                {/* Vercel Analytics + Speed Insights – placed at the end for minimal impact */}
                <Analytics mode="production" />
                <SpeedInsights />
            </body>
        </html>
    );
}