'use client';

import { Share2, Link as LinkIcon, Check, Mail } from 'lucide-react';
import { useState } from 'react';

interface ShareProps {
    title: string;
    url: string;
}

export const ShareButtons = ({ title, url }: ShareProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const handleNativeShare = () => {
        if (navigator.share) {
            navigator.share({ title, url }).catch(() => { });
        }
    };

    const shareText = `${title} — ${url}`;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Social Icons - Larger, consistent padding, better hover feedback */}
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border bg-background hover:bg-muted transition-all text-muted-foreground hover:text-[#1877F2] dark:bg-slate-800 dark:hover:bg-slate-700"
                aria-label="Share on Facebook"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="h-5 w-5 fill-current">
                    <path d="M240 363.3L240 576L356 576L356 363.3L442.5 363.3L460.5 265.5L356 265.5L356 230.9C356 179.2 376.3 159.4 428.7 159.4C445 159.4 458.1 159.8 465.7 160.6L465.7 71.9C451.4 68 416.4 64 396.2 64C289.3 64 240 114.5 240 223.4L240 265.5L174 265.5L174 363.3L240 363.3z" />
                </svg>
            </a>

            <a
                href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border bg-background hover:bg-muted transition-all text-muted-foreground hover:text-foreground dark:bg-slate-800 dark:hover:bg-slate-700"
                aria-label="Share on X"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="h-5 w-5 fill-current">
                    <path d="M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z" />
                </svg>
            </a>

            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border bg-background hover:bg-muted transition-all text-muted-foreground hover:text-[#0A66C2] dark:bg-slate-800 dark:hover:bg-slate-700"
                aria-label="Share on LinkedIn"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="h-5 w-5 fill-current">
                    <path d="M196.3 512L103.4 512L103.4 212.9L196.3 212.9L196.3 512zM149.8 172.1C120.1 172.1 96 147.5 96 117.8C96 103.5 101.7 89.9 111.8 79.8C121.9 69.7 135.6 64 149.8 64C164 64 177.7 69.7 187.8 79.8C197.9 89.9 203.6 103.6 203.6 117.8C203.6 147.5 179.5 172.1 149.8 172.1zM543.9 512L451.2 512L451.2 366.4C451.2 331.7 450.5 287.2 402.9 287.2C354.6 287.2 347.2 324.9 347.2 363.9L347.2 512L254.4 512L254.4 212.9L343.5 212.9L343.5 253.7L344.8 253.7C357.2 230.2 387.5 205.4 432.7 205.4C526.7 205.4 544 267.3 544 347.7L544 512L543.9 512z" />
                </svg>
            </a>

            <a
                href={`https://bsky.app/intent/compose?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border bg-background hover:bg-muted transition-all text-muted-foreground hover:text-[#1185FE] dark:bg-slate-800 dark:hover:bg-slate-700"
                aria-label="Share on Bluesky"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="h-5 w-5 fill-current">
                    <path d="M439.8 358.7C436.5 358.3 433.1 357.9 429.8 357.4C433.2 357.8 436.5 358.3 439.8 358.7zM320 291.1C293.9 240.4 222.9 145.9 156.9 99.3C93.6 54.6 69.5 62.3 53.6 69.5C35.3 77.8 32 105.9 32 122.4C32 138.9 41.1 258 47 277.9C66.5 343.6 136.1 365.8 200.2 358.6C203.5 358.1 206.8 357.7 210.2 357.2C206.9 357.7 203.6 358.2 200.2 358.6C106.3 372.6 22.9 406.8 132.3 528.5C252.6 653.1 297.1 501.8 320 425.1C342.9 501.8 369.2 647.6 505.6 528.5C608 425.1 533.7 372.5 439.8 358.6C436.5 358.2 433.1 357.8 429.8 357.3C433.2 357.7 436.5 358.2 439.8 358.6C503.9 365.7 573.4 343.5 593 277.9C598.9 258 608 139 608 122.4C608 105.8 604.7 77.7 586.4 69.5C570.6 62.4 546.4 54.6 483.2 99.3C417.1 145.9 346.1 240.4 320 291.1z" />
                </svg>
            </a>

            <a
                href={`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border bg-background hover:bg-muted transition-all text-muted-foreground hover:text-[#FF4500] dark:bg-slate-800 dark:hover:bg-slate-700"
                aria-label="Share on Reddit"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="h-5 w-5 fill-current">
                    <path d="M437 202.6C411.8 202.6 390.7 185.1 385.1 161.6C354.5 165.9 330.9 192.3 330.9 224L330.9 224.2C378.3 226 421.5 239.3 455.8 260.5C468.4 250.8 484.2 245 501.3 245C542.6 245 576 278.4 576 319.7C576 349.5 558.6 375.2 533.3 387.2C530.9 474 436.3 543.8 320.1 543.8C203.9 543.8 109.5 474.1 107 387.4C81.6 375.5 64 349.7 64 319.7C64 278.4 97.4 245 138.7 245C155.9 245 171.7 250.8 184.4 260.6C218.4 239.5 261.2 226.2 308.1 224.2L308.1 223.9C308.1 179.6 341.8 143 384.9 138.4C389.8 114.2 411.2 96 437 96C466.4 96 490.3 119.9 490.3 149.3C490.3 178.7 466.4 202.6 437 202.6zM221.5 319.3C200.6 319.3 182.6 340.1 181.3 367.2C180 394.3 198.4 405.3 219.3 405.3C240.2 405.3 255.9 395.5 257.1 368.4C258.3 341.3 242.4 319.3 221.4 319.3L221.5 319.3zM459 367.1C457.8 340 439.8 319.2 418.8 319.2C397.8 319.2 381.9 341.2 383.1 368.3C384.3 395.4 400 405.2 420.9 405.2C441.8 405.2 460.2 394.2 458.9 367.1L459 367.1zM398.9 437.9C400.4 434.3 397.9 430.2 394 429.8C371 427.5 346.1 426.2 320.2 426.2C294.3 426.2 269.4 427.5 246.4 429.8C242.5 430.2 240 434.3 241.5 437.9C254.4 468.7 284.8 490.3 320.2 490.3C355.6 490.3 386 468.7 398.9 437.9z" />
                </svg>
            </a>

            {/* Email */}
            <a
                href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText)}`}
                className="p-3 rounded-xl border bg-background hover:bg-muted transition-all text-muted-foreground hover:text-foreground dark:bg-slate-800 dark:hover:bg-slate-700"
                aria-label="Share via Email"
            >
                <Mail className="h-5 w-5" />
            </a>

            {/* Copy Link Button - More prominent and consistent */}
            <button
                onClick={handleCopy}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl border bg-background hover:bg-muted dark:bg-slate-800 dark:hover:bg-slate-700 transition-all text-sm font-medium text-muted-foreground hover:text-foreground"
            >
                {copied ? (
                    <>
                        <Check className="h-4 w-4 text-green-500" />
                        Copied!
                    </>
                ) : (
                    <>
                        <LinkIcon className="h-4 w-4" />
                        Copy link
                    </>
                )}
            </button>
            {/* Native share */}
            <button
                onClick={handleNativeShare}
                className="p-3 rounded-xl border bg-background hover:bg-muted transition-all text-muted-foreground hover:text-foreground dark:bg-slate-800 dark:hover:bg-slate-700"
                aria-label="Share"
            >
                <Share2 className="h-5 w-5" />
            </button>
        </div>
    );
};