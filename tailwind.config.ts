import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--foreground)",
                },
                secondary: {
                    DEFAULT: "var(--beige-dark)",
                    foreground: "var(--foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--background)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-light)",
                    light: "var(--muted-light)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--background)",
                    light: "var(--accent-light)",
                    dark: "var(--accent-dark)",
                },
                border: "var(--border)",
                beige: {
                    DEFAULT: "var(--beige)",
                    dark: "var(--beige-dark)",
                    darker: "var(--beige-darker)",
                },
                card: {
                    DEFAULT: "var(--card-beige)",
                },
            },
            fontFamily: {
                sans: ["var(--font-sans)", "system-ui", "sans-serif"],
                serif: ["var(--font-serif)", "Georgia", "serif"],
            },
            fontSize: {
                'display': ['clamp(4rem, 15vw, 12rem)', { lineHeight: '0.85', letterSpacing: '-0.03em' }],
                'heading': ['clamp(2.5rem, 8vw, 6rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
                'subheading': ['clamp(1.5rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
                'body-lg': ['1.25rem', { lineHeight: '1.6' }],
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
                'slide-up': 'slideUp 0.8s ease-out forwards',
                'slide-in-right': 'slideInRight 1s ease-out forwards',
                'scale-in': 'scaleIn 0.6s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
                'marquee': 'marquee 30s linear infinite',
                'scroll-line': 'scrollLine 1.5s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(60px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(-40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                scrollLine: {
                    '0%': { transform: 'translateY(-100%)' },
                    '50%': { transform: 'translateY(0%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
            },
        },
    },
    plugins: [],
};
export default config;
