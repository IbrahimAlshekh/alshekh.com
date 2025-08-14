import laravelImg from '../../images/laravel.png';
import inertiaImg from '../../images/inertia.png';
import reactImg from '../../images/reactjs.png';
import typescriptImg from '../../images/typescript.png';
import tailwindImg from '../../images/tailwindcss.png';
import postgresqlImg from '../../images/postgress.png';
import type { StackItem } from '@/types/app';

export const stack: ReadonlyArray<StackItem> = [
    {
        name: 'Laravel',
        logo: laravelImg,
        classes: 'border-red-400/30 bg-gradient-to-br from-red-500/15 to-red-500/5 text-red-100',
        dot: 'bg-red-400',
    },
    {
        name: 'Inertia.js',
        logo: inertiaImg,
        classes: 'border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-500/15 to-fuchsia-500/5 text-fuchsia-100',
        dot: 'bg-fuchsia-400',
    },
    {
        name: 'React',
        logo: reactImg,
        classes: 'border-cyan-400/30 bg-gradient-to-br from-cyan-500/15 to-cyan-500/5 text-cyan-100',
        dot: 'bg-cyan-400',
    },
    {
        name: 'TypeScript',
        logo: typescriptImg,
        classes: 'border-blue-400/30 bg-gradient-to-br from-blue-500/15 to-blue-500/5 text-blue-100',
        dot: 'bg-blue-400',
    },
    {
        name: 'Tailwind CSS',
        logo: tailwindImg,
        classes: 'border-teal-400/30 bg-gradient-to-br from-teal-500/15 to-teal-500/5 text-teal-100',
        dot: 'bg-teal-400',
    },
    {
        name: 'PostgreSQL',
        logo: postgresqlImg,
        classes: 'border-indigo-400/30 bg-gradient-to-br from-indigo-500/15 to-indigo-500/5 text-indigo-100',
        dot: 'bg-indigo-400',
    },
] as const;
