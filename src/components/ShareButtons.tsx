'use client';

import React from 'react';
import { Button } from '@/components/ui/badge'; // Or your custom button
import { Share2, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
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
        setTimeout(() => setCopied(false), 2000);
    };

    const handleNativeShare = () => {
        if (navigator.share) {
            navigator.share({ title, url }).catch(console.error);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-md font-bold text-muted-foreground mr-2">Share:</span>

            {/* Native Share (Mobile) */}
            <button
                onClick={handleNativeShare}
                className="p-2 rounded-full border bg-background hover:bg-muted transition-colors sm:hidden"
            >
                <Share2 className="h-4 w-4" />
            </button>

            {/* Twitter/X */}
            <a
                href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-full border bg-background hover:bg-muted transition-colors text-zinc-400 hover:text-zinc-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="h-6 w-6 fill-current"><path d="M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z" /></svg>
            </a>

            {/* LinkedIn */}
            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-full border bg-background hover:bg-muted transition-colors text-zinc-400 hover:text-zinc-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="h-6 w-6 fill-current"><path d="M196.3 512L103.4 512L103.4 212.9L196.3 212.9L196.3 512zM149.8 172.1C120.1 172.1 96 147.5 96 117.8C96 103.5 101.7 89.9 111.8 79.8C121.9 69.7 135.6 64 149.8 64C164 64 177.7 69.7 187.8 79.8C197.9 89.9 203.6 103.6 203.6 117.8C203.6 147.5 179.5 172.1 149.8 172.1zM543.9 512L451.2 512L451.2 366.4C451.2 331.7 450.5 287.2 402.9 287.2C354.6 287.2 347.2 324.9 347.2 363.9L347.2 512L254.4 512L254.4 212.9L343.5 212.9L343.5 253.7L344.8 253.7C357.2 230.2 387.5 205.4 432.7 205.4C526.7 205.4 544 267.3 544 347.7L544 512L543.9 512z" /></svg>
            </a>

            {/* Copy Link */}
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-background hover:bg-muted transition-all text-xs font-medium"
            >
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <LinkIcon className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy Link'}
            </button>
        </div>
    );
};