export default function SkipLink() {
    return (
        <a
            href="#main-content"
            className="
                absolute left-4 -top-4 z-[100]
                bg-white dark:bg-zinc-900 
                text-zinc-900 dark:text-white
                px-4 py-2 
                text-sm font-medium
                border border-zinc-300 dark:border-zinc-700
                rounded-md shadow-sm
                -translate-y-full 
                focus:translate-y-8 
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                transition-all duration-200
            "
        >
            Skip to main content.
        </a>
    );
}