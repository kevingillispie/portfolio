// src/app/contact/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import ContactForm from "@/components/ContactForm";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { getScscSchema } from '@/lib/server/get-scsc-schema';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with Kevin Gillispie for collaborations, questions, or project inquiries.",
    openGraph: {
        title: "Contact Kevin Gillispie",
        description: "Reach out about web development, Next.js projects, or custom tools.",
        images: ["/opengraph-image.png"], // Or a contact-specific image if you make one
    },
};

export default async function ContactPage() {
    const schemas = await getScscSchema('/contact');

    return (
        <>
            {/* Page-specific schema – Next.js places in <head> automatically */}
            {
                schemas.map((schema: any, i: number) => (
                    <Script
                        id={`schema-scalpel-${i}`}
                        className='schema-scalpel'
                        key={`schema-${i}`}
                        type="application/ld+json"
                        strategy="beforeInteractive"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                    />
                ))
            }
            <div className="container mx-auto mb-24 max-w-5xl py-12 md:py-20 px-6 md:px-0">
                <div className="hero-container text-center mt-8 pb-12">
                    <Badge variant="secondary" className="mb-6 shadow-lg bg-background/80 backdrop-blur-sm">
                        <BreadcrumbNav />
                    </Badge>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto">
                        Have a project idea, question about my work, or just want to say hi? Drop me a message!
                    </p>
                </div>
                <ContactForm />
            </div>
        </>
    );
}