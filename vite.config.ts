/// <reference types="vitest" />

import analog, { PrerenderContentFile } from '@analogjs/platform';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

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
                }
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
        ViteImageOptimizer({
            jpg: {
                quality: 80,
            },
            svg: {
                plugins: [
                    {
                        name: 'preset-default',
                        params: {
                            overrides: {
                                inlineStyles: false,
                            },
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
