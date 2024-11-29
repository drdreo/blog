/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog, { PrerenderContentFile } from '@analogjs/platform';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    build: {
        target: ['es2020'],
    },
    resolve: {
        mainFields: ['module'],
    },
    plugins: [
        analog({
            content: {
                highlighter: 'shiki',
                shikiOptions: {
                    highlighter: {
                        // add more languages
                        additionalLangs: ['shellscript'],
                    },
                },
            },
            prerender: {
                sitemap: {
                    host: 'https://blog.drdreo.com/',
                },
                routes: async () => [
                    '/',
                    {
                        contentDir: 'src/content',
                        transform: (file: PrerenderContentFile) => {
                            // do not include files marked as draft in frontmatter
                            if (file.attributes['draft']) {
                                return false;
                            }
                            // use the slug from frontmatter if defined, otherwise use the files basename
                            const slug = file.attributes['slug'] || file.name;
                            return `/${slug}`;
                        },
                    },
                ],
            },
        }),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['src/test-setup.ts'],
        include: ['**/*.spec.ts'],
        reporters: ['default'],
    },
    define: {
        'import.meta.vitest': mode !== 'production',
    },
}));
