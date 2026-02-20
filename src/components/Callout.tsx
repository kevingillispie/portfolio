import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "warning" | "error";

interface CalloutProps {
    type?: CalloutType;
    children: React.ReactNode;
    className?: string;
}

export function Callout({
    type = "info",
    children,
    className,
}: CalloutProps) {
    const variants = {
        info: {
            border: "border-blue-500/50",
            bg: "bg-blue-50/70 dark:bg-blue-950/40",
            text: "text-blue-900 dark:text-blue-100",
        },
        warning: {
            border: "border-yellow-500/50",
            bg: "bg-yellow-50/70 dark:bg-yellow-950/40",
            text: "text-yellow-900 dark:text-yellow-100",
        },
        error: {
            border: "border-red-500/50",
            bg: "bg-red-50/70 dark:bg-red-950/40",
            text: "text-red-900 dark:text-red-100",
        },
    };

    const variant = variants[type];

    return (
        <Card
            className={cn(
                "float-right clear-right ml-6 mb-6 w-full max-w-xs md:max-w-sm",
                "border-2 shadow-md",
                variant.border,
                variant.bg,
                variant.text,
                className
            )}
        >
            <CardContent className="p-5 text-sm leading-relaxed">
                {children}
            </CardContent>
        </Card>
    );
}