// src/components/SchemaHeadWrapper.tsx
import { SchemaWebPage, SchemaBreadcrumb, SchemaArticle, /* etc. */ } from '@kevingillispie/schema-scalpel-js';
import type { ReactNode } from 'react';

interface SchemaHeadWrapperProps {
    children: ReactNode;
    pageName?: string;               // optional override for WebPage
    articleData?: any;               // if page is an article
    // add more props as needed (e.g. breadcrumbItems)
}

export default async function SchemaHeadWrapper({
    children,
    pageName,
    articleData,
}: SchemaHeadWrapperProps) {
    return (
        <>
            {/* All schema scripts go here — rendered in <head> via Next.js hoisting */}
            <SchemaWebPage name={pageName || 'Default Page Title'} />
            <SchemaBreadcrumb />

            {articleData && <SchemaArticle data={articleData} />}

            {children}
        </>
    );
}