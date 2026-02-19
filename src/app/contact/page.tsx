// src/app/contact/page.tsx  ← This becomes a Server Component (no "use client")
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";  // We'll create this next

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
        <div className="container mx-auto max-w-2xl py-16 md:py-24">
            <h1 className="text-4xl font-bold tracking-tight mb-8 text-center">
                Get in Touch
            </h1>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
                Have a project idea, question about my work, or just want to say hi? Drop me a message!
            </p>

            <ContactForm />  {/* Client-side form lives here */}
        </div>
    );
}