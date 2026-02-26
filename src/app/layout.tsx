import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import SettingsMenu from "@/components/SettingsMenu";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ParticlesBackground from "@/components/ParticlesBackground";
import TransitionCanvas from "@/components/TransitionCanvas";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kevingillispie.com"), // Use env var for prod URL
    title: {
        default: "Kevin Gillispie – Full-Stack Web Developer",
        template: "%s | Kevin Gillispie", // %s gets replaced by page-specific title
    },
    description: "Full-stack web developer specializing in Next.js, TypeScript, Tailwind, shadcn/ui. Building performant SEO plugins, browser security tools, and modern sites.",
    keywords: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "web developer", "portfolio", "SEO plugins", "browser extensions"],
    authors: [{ name: "Kevin Gillispie", url: "https://kevingillispie.com" }],
    creator: "Kevin Gillispie",
    openGraph: {
        title: "Kevin Gillispie – Full-Stack Web Developer",
        description: "Building performant tools, SEO plugins, browser extensions, and modern websites with Next.js & TypeScript.",
        url: "https://kevingillispie.com",
        siteName: "Kevin Gillispie",
        images: [
            {
                url: "/opengraph-image.png", // Static OG image in public/ folder
                width: 1200,
                height: 630,
                alt: "Kevin Gillispie - Full-Stack Web Developer Portfolio",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Kevin Gillispie – Full-Stack Web Developer",
        description: "Building performant tools, SEO plugins, browser extensions, and modern websites.",
        images: ["/opengraph-image.png"], // Can reuse the same image
        creator: "@yourhandle", // Add your X handle if you have one
    },
    // Optional: robots, alternates, icons, etc.
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`
          ${geistSans.variable} ${geistMono.variable}
          min-h-screen flex flex-col bg-gradient-to-br from-zinc-300 via-zinc-50 to-zinc-200 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700
        `}
            >
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <div id="nav-overlay" />
                    <TransitionCanvas />
                    <div className="relative z-10 flex flex-col min-h-screen">
                        <Navbar />
                        <SettingsMenu />

                        {/* Main content grows to fill remaining space */}
                        <main className="flex-1">
                            {children}
                        </main>

                        <Footer />
                    </div>

                    <Toaster
                        position="top-right"
                        richColors
                        closeButton
                        duration={5000}
                    />
                </ThemeProvider>
            </body>
        </html>
    );
}
