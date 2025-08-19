import postgressImage from '@images/postgress.png';
import laravelImg from '@images/laravel.png';
import inertiaImg from '@images/inertia.png';
import reactImg from '@images/reactjs.png';
import typescriptImg from '@images/typescript.png';
import tailwindImg from '@images/tailwindcss.png';

export type FeatureCard = {
    image: string;
    title: string;
    description: string;
};

export const cards: ReadonlyArray<FeatureCard> = [
    {
        image: laravelImg,
        title: 'Laravel',
        description:
            'Robust backend framework with expressive Eloquent ORM, queues, mail, and a rich ecosystem — ideal for rapid, maintainable product delivery.',
    },
    {
        image: inertiaImg,
        title: 'Inertia.js',
        description:
            'A glue between Laravel and React — no API boilerplate, server-driven routing, and a single codebase for faster iteration.',
    },
    {
        image: reactImg,
        title: 'React + TypeScript',
        description:
            'Component-driven UI with type safety for refactor-friendly, reliable frontends and developer velocity.',
    },
    {
        image: typescriptImg,
        title: 'TypeScript',
        description:
            'Strong typing for a more productive development experience, with static analysis and IDE support for a robust codebase.',
    },
    {
        image: tailwindImg,
        title: 'Tailwind CSS',
        description:
            'Utility‑first styling that accelerates shipping consistent, responsive designs without context switching.',
    },
    {
        image: postgressImage,
        title: 'PostgreSQL',
        description:
            'Robust database management system with a rich ecosystem — ideal for scalable, secure, and reliable product delivery.',
    }
] as const;
