// src/app/thank-you/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { getMediaBySlug } from '@/lib/server/media';

export const metadata: Metadata = {
    title: 'Thank You | Kevin Gillispie',
    description: 'Your message has been received. We’ll get back to you soon.',
    robots: { index: false, follow: false },
};

export default async function ThankYouPage() {
    // Fetch the image by its slug in WordPress Media Library
    const media = await getMediaBySlug('message-received');

    // Fallback to static file if WP fails
    const imageSrc = media?.sourceUrl || '/media/message-received.png';
    const imageAlt = media?.altText || 'Message received!';

    return (
        <div className="container mx-auto mb-24 max-w-5xl py-12 md:py-20 px-6 md:px-0">
            <div className="hero-container text-center mt-8 pb-12">
                <div className="pointer-events-auto">
                    <Badge variant="default" className="badge-shadow mb-6 py-1 dark:text-zinc-300 dark:bg-slate-800 dark:border dark:border-gray-600">
                        <strong>Success!</strong>
                    </Badge>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                        Thank You!
                    </h1>
                    <p className="text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto">Your message has been received.</p>
                    <p className="text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto">I&rsquo;ll get back to you as soon as possible.</p>
                    <p className="text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto text-blue-600/80 italic">(usually within 24 hours)</p>
                </div>
            </div>

            {/* Clean responsive image with Next.js Image optimization */}
            <div className="relative w-full aspect-[16/9] md:aspect-[2/1] mb-12 rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1200px) 90vw, 1100px"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                    <Button size="lg" className="cursor-pointer w-full"><strong>Homepage</strong></Button>
                </Link>
                <Link href="/blog">
                    <Button size="lg" className="cursor-pointer w-full">
                        <code>//PlainText</code>
                    </Button>
                </Link>
            </div>
        </div>
    );
}