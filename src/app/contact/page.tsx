// src/app/contact/page.tsx  ← This becomes a Server Component (no "use client")
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with Kevin Gillispie for collaborations, questions, or project inquiries.",
    openGraph: {
        title: "Contact Kevin Gillispie",
        description: "Reach out about web development, Next.js projects, or custom tools.",
        images: ["/opengraph-image.png"], // Or a contact-specific image if you make one
    },
    // Inherits everything else from root
};

export default function ContactPage() {
    return (
        <div className="container mx-auto max-w-5xl py-12 md:py-20">
            <div className="text-center mt-8 pb-12">
                <Badge variant="secondary" className="mb-6 shadow bg-background/80 backdrop-blur-sm">
                    <BreadcrumbNav />
                </Badge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                    Get in Touch
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto">
                    Have a project idea, question about my work, or just want to say hi? Drop me a message!
                </p>
            </div>
            <div className="w-xl mx-auto">
                <ContactForm />
            </div>
        </div>
    );
}