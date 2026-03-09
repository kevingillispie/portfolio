// src/config/schemaConfig.ts
import type { SchemaConfig } from '@kevingillispie/schema-scalpel-js';

export const schemaConfig: SchemaConfig = {
    website: {
        name: "Kevin Gillispie – Full-Stack Web Developer",
        searchPathTemplate: undefined, // No search → no SearchAction
    },
    organization: {
        name: "Kevin Gillispie",
        logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`, // or static path
        sameAs: [
            "https://twitter.com/kevinlgillispie",
            "https://github.com/kevingillispie",
            // add LinkedIn, etc.
        ],
    },
};