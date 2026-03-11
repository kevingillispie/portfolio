// tailwind.config.ts
import type { Config } from "tailwindcss"
import typography from "@tailwindcss/typography"

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            // CSS variable mapping in globals.css
        },
    },
    plugins: [
        typography,
    ],
}

export default config