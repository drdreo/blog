import tailwindForms from "@tailwindcss/forms";
import tailwindTypography from '@tailwindcss/typography';
import type {Config} from 'tailwindcss';
import * as colors from "tailwindcss/colors";
import {fontFamily} from "tailwindcss/defaultTheme";

export default {
    content: ['./index.html', './src/**/*.{html,ts,md,analog,ag}'],
    darkMode: 'media',
    theme: {
        extend: {
            lineHeight: {
                11: '2.75rem',
                12: '3rem',
                13: '3.25rem',
                14: '3.5rem',
            },
            fontFamily: {
                sans: ['"Onest"', ...fontFamily.sans],
            },
            colors: {
                primary: colors.yellow,
                gray: colors.gray,
            },
            zIndex: {
                60: '60',
                70: '70',
                80: '80',
            },
            typography: ({theme} : any) => ({
                DEFAULT: {
                    css: {
                        a: {
                            color: theme('colors.primary.500'),
                            '&:hover': {
                                color: `${theme('colors.primary.600')}`,
                            },
                            code: {color: theme('colors.primary.400')},
                        },
                        'h1,h2': {
                            fontWeight: '700',
                            letterSpacing: theme('letterSpacing.tight'),
                        },
                        h3: {
                            fontWeight: '600',
                        },
                        code: {
                            color: theme('colors.indigo.500'),
                        },
                    },
                },
                invert: {
                    css: {
                        a: {
                            color: theme('colors.primary.500'),
                            '&:hover': {
                                color: `${theme('colors.primary.400')}`,
                            },
                            code: {color: theme('colors.primary.400')},
                        },
                        'h1,h2,h3,h4,h5,h6': {
                            color: theme('colors.gray.100'),
                        },
                    },
                },
            }),
        },
    },
    plugins: [tailwindForms, tailwindTypography],
} satisfies Config;
