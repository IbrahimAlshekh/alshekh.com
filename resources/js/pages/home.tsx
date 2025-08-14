import { Head } from '@inertiajs/react';
import type { FC } from 'react';
import { Facebook, Globe, Linkedin, Megaphone, Send, Twitter, Atom, Wind, Database, Flame, SquareCode, RefreshCcw, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

type IconType = FC<{ className?: string }>;

const SocialLink: FC<{ href: string; label: string; Icon: IconType }> = ({ href, label, Icon }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={label}
        className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 shadow-sm backdrop-blur transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        whileHover={{ y: -2, scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
    >
        <Icon className="h-4 w-4 text-white/80 transition group-hover:scale-110 group-hover:text-white" />
        <span className="hidden sm:inline">{label}</span>
    </motion.a>
);

type StackItem = { name: string; Icon: IconType; classes: string; dot: string };

const stack: StackItem[] = [
    { name: 'Laravel', Icon: Flame, classes: 'border-red-400/30 bg-gradient-to-br from-red-500/15 to-red-500/5 text-red-100', dot: 'bg-red-400' },
    { name: 'Inertia.js', Icon: RefreshCcw, classes: 'border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-500/15 to-fuchsia-500/5 text-fuchsia-100', dot: 'bg-fuchsia-400' },
    { name: 'React', Icon: Atom, classes: 'border-cyan-400/30 bg-gradient-to-br from-cyan-500/15 to-cyan-500/5 text-cyan-100', dot: 'bg-cyan-400' },
    { name: 'TypeScript', Icon: SquareCode, classes: 'border-blue-400/30 bg-gradient-to-br from-blue-500/15 to-blue-500/5 text-blue-100', dot: 'bg-blue-400' },
    { name: 'Tailwind CSS', Icon: Wind, classes: 'border-teal-400/30 bg-gradient-to-br from-teal-500/15 to-teal-500/5 text-teal-100', dot: 'bg-teal-400' },
    { name: 'PostgreSQL', Icon: Database, classes: 'border-indigo-400/30 bg-gradient-to-br from-indigo-500/15 to-indigo-500/5 text-indigo-100', dot: 'bg-indigo-400' },
] as const;

const AnimatedNamePath: FC = () => {
    return (
        <div className="w-full max-w-3xl">
            <h1 className="sr-only">Ibrahim Alshekh</h1>
            <motion.svg
                viewBox="0 0 1200 200"
                preserveAspectRatio="none"
                className="mx-auto h-24 w-full sm:h-28 md:h-36"
                initial="hidden"
                animate="visible"
            >
                <defs>
                    <linearGradient id="nameStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="nameFill" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#d4d4d4" />
                    </linearGradient>
                    <filter id="blur" x="-10%" y="-10%" width="120%" height="120%">
                        <feGaussianBlur stdDeviation="8" />
                    </filter>
                    <path id="name-curve" d="M20,120 C300,10 900,190 1180,80" />

                    {/* Shimmer gradient and mask for animated text highlight */}
                    <linearGradient id="shineGradient" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                    <mask id="shine-mask" x="0" y="0" width="1200" height="200" maskUnits="userSpaceOnUse">
                        <motion.rect
                            x="-300"
                            y="0"
                            width="300"
                            height="200"
                            fill="url(#shineGradient)"
                            animate={{ x: [-300, 1500] }}
                            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </mask>
                </defs>

                {/* Glow trail behind the text */}
                <motion.path
                    d="M20,120 C300,10 900,190 1180,80"
                    fill="none"
                    stroke="#22d3ee"
                    strokeOpacity="0.2"
                    strokeWidth="10"
                    filter="url(#blur)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Main curve draw-in */}
                <motion.path
                    d="M20,120 C300,10 900,190 1180,80"
                    fill="none"
                    stroke="url(#nameStroke)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.9 }}
                    transition={{ duration: 1.6, ease: 'easeInOut' }}
                />

                {/* Animated text along the curve */}
                <g>
                    {/* Base text with slight stroke for readability; subtle drift along the path */}
                    <text
                        fontSize="56"
                        className="font-semibold tracking-tight"
                        fill="url(#nameFill)"
                        stroke="#ffffff"
                        strokeOpacity="0.15"
                        strokeWidth="1"
                    >
                        <motion.textPath
                            href="#name-curve"
                            startOffset="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            animate={{ startOffset: ['49%', '51%', '49%'] }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            Ibrahim Alshekh
                        </motion.textPath>
                    </text>

                    {/* Shimmer highlight pass over the text */}
                    <text
                        fontSize="56"
                        className="font-semibold tracking-tight"
                        fill="#ffffff"
                        opacity="0.9"
                        mask="url(#shine-mask)"
                    >
                        <textPath href="#name-curve" startOffset="50%" textAnchor="middle" dominantBaseline="middle">
                            Ibrahim Alshekh
                        </textPath>
                    </text>
                </g>
            </motion.svg>
        </div>
    );
};

const Home: FC = () => {
    // Scroll-driven parallax for background layers
    const { scrollY } = useScroll();
    const parallaxTop = useTransform(scrollY, [0, 600], [0, -80]);
    const parallaxBottom = useTransform(scrollY, [0, 600], [0, 60]);
    const parallaxChips = useTransform(scrollY, [0, 600], [0, -20]);

    // Variants for scroll-reveal
    const containerVariants = {
        hidden: { opacity: 0, y: 16 },
        show: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.06, delayChildren: 0.1 },
        },
    } as const;

    const itemVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1 },
    } as const;

    return (
        <>
            <Head title="Ibrahim Alshekh" />

            {/* Background */}
            <div className="relative overflow-hidden bg-neutral-950 text-white">
                {/* Animated gradient orbs with subtle parallax */}
                <motion.div
                    className="pointer-events-none absolute -left-1/3 -top-1/3 h-[80vh] w-[80vh] rounded-full bg-[conic-gradient(at_top_left,_#06b6d4,_#6366f1,_#22c55e,_#06b6d4)] opacity-30 blur-3xl animate-[spin_45s_linear_infinite]"
                    style={{ y: parallaxTop }}
                    aria-hidden
                />
                <motion.div
                    className="pointer-events-none absolute -right-1/4 -bottom-1/4 h-[70vh] w-[70vh] rounded-full bg-[conic-gradient(at_bottom_right,_#f97316,_#ef4444,_#eab308,_#f97316)] opacity-20 blur-3xl animate-[spin_60s_linear_infinite_reverse]"
                    style={{ y: parallaxBottom }}
                    aria-hidden
                />
                {/* Subtle grid */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent_1px,rgba(255,255,255,0.02)_1px)] [background-size:32px_32px]" />

                {/* Tech stack decorative background chips (float slightly on scroll) */}
                <motion.div aria-hidden className="pointer-events-none absolute inset-0 select-none" style={{ y: parallaxChips }}>
                    <div className="mx-auto flex h-full max-w-5xl flex-wrap items-center justify-center gap-4 opacity-10 blur-[1px]">
                        {Array.from({ length: 3 }).map((_, row) => (
                            <div key={row} className="flex w-full flex-wrap items-center justify-center gap-3">
                                {stack.map((item, i) => (
                                    <span
                                        key={`${row}-${i}`}
                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wide text-white/80"
                                    >
                                        {item.name}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top navigation */}
                <header className="pointer-events-auto fixed inset-x-0 top-0 z-20 mx-auto max-w-6xl px-4">
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/80 backdrop-blur">
                        <a href="#top" className="font-semibold text-white hover:text-white/90">Ibrahim Alshekh</a>
                        <nav className="hidden gap-6 sm:flex">
                            <a href="#about" className="hover:text-white">About</a>
                            <a href="#tech" className="hover:text-white">Tech Stack</a>
                            <a href="#contact" className="hover:text-white">Contact</a>
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <motion.main
                    id="top"
                    className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-24 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 shadow-sm backdrop-blur">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                        <span>Laravel · Inertia.js · React · TypeScript · Tailwind CSS · PostgreSQL</span>
                    </div>

                    <AnimatedNamePath />
                    <motion.p
                        className="mx-auto mt-4 max-w-2xl text-balance text-base text-white/70 sm:text-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Fullstack Developer & IT Manager specializing in PHP/Laravel, React & TypeScript, and system integration. Currently leading IT at smartcon GmbH—building high-performance apps, intuitive UIs, and mentoring teams.
                    </motion.p>

                    <motion.div
                        id="contact"
                        className="mt-10 flex flex-wrap items-center justify-center gap-3"
                        initial="hidden"
                        animate="show"
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <SocialLink href="https://x.com/IbrahimAlshekh_" label="X (Twitter)" Icon={Twitter} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <SocialLink href="https://www.facebook.com/Ibrahim0Alshekh/" label="Facebook" Icon={Facebook} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <SocialLink href="https://www.linkedin.com/in/ibrahim-shekh-mohammed-0275b5152/" label="LinkedIn" Icon={Linkedin} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <SocialLink href="https://qabilah.com/profile/ibrahimalshekh" label="Qabilah.com" Icon={Globe} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <SocialLink href="https://t.me/ibrahim_alshekh" label="Telegram" Icon={Send} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <SocialLink href="https://whatsapp.com/channel/0029VbAtsF62kNFkMAFBBJ06" label="WhatsApp Channel" Icon={Megaphone} />
                        </motion.div>
                    </motion.div>

                    {/* Bouncing scroll indicator */}
                    <motion.a
                        aria-label="Scroll to content"
                        className="pointer-events-auto group absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex flex-col items-center text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        whileHover={{ y: -2 }}
                    >
                        <span className="rounded-full border border-white/10 bg-white/5 p-2 shadow-sm backdrop-blur">
                            <ChevronDown className="h-6 w-6 animate-bounce" />
                        </span>
                    </motion.a>
                </motion.main>

                {/* Tech Stack Section */}
                <section id="tech" className="relative mx-auto w-full max-w-4xl px-6 py-10">
                    <motion.div
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur sm:p-6"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                            <span>My Tech Stack</span>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-white/70">
                            My preferred toolkit — full‑stack balance with backend muscle and frontend finesse. Laravel + PostgreSQL power the core, Inertia keeps the bridge seamless, and React + TypeScript + Tailwind craft fast, elegant UIs. It covers most product use‑cases without extra baggage.
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                            {stack.map(({ name, Icon, classes, dot }, idx) => (
                                <motion.span
                                    key={name}
                                    className={`group inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm shadow-sm backdrop-blur transition ${classes}`}
                                    variants={itemVariants}
                                    custom={idx}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                                    <Icon className="h-4 w-4 opacity-90 transition group-hover:scale-110" />
                                    <span className="font-medium">{name}</span>
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* About / Description Section */}
                <section id="about" className="relative mx-auto w-full max-w-4xl px-6 py-16">
                    <motion.div
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur sm:p-8"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.25 }}
                        variants={containerVariants}
                    >
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                            <span>About me</span>
                        </div>
                        <motion.h2 className="text-balance text-2xl font-semibold text-white sm:text-3xl" variants={itemVariants}>
                            Fullstack Developer & IT Manager with Expertise in PHP, Laravel, and Frontend Technologies
                        </motion.h2>
                        <div className="prose prose-invert mt-4 max-w-none text-white/80">
                            <motion.p variants={itemVariants}>
                                I am an experienced Fullstack Developer and IT Manager with a strong background in software
                                development, project management, and team leadership. I have a deep knowledge of both backend
                                and frontend technologies, specializing in PHP, Laravel, React (Next.js), Vue.js, and Livewire.
                                With several years of experience, I have successfully led complex IT projects from conception to
                                deployment, focusing on creating high-performance applications, intuitive UI/UX designs, and
                                integrating systems to optimize processes.
                            </motion.p>
                            <motion.p variants={itemVariants}>
                                Throughout my career, I have been responsible for managing IT departments, training team members,
                                and ensuring the smooth operation of systems. I’ve also contributed to the development of survey
                                software, live dashboards for real-time analysis, and automated workflows using Python. My ability
                                to work under pressure, attention to detail, and clear communication have allowed me to consistently
                                achieve excellent results.
                            </motion.p>
                            <motion.h3 className="mt-8 text-xl font-semibold text-white" variants={itemVariants}>Key areas of expertise:</motion.h3>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-white/85">
                                {[
                                    'Fullstack Development (PHP, Laravel, React, Vue.js, Livewire)',
                                    'UI/UX Design and Prototyping with Figma',
                                    'Project Management and Leadership',
                                    'System Integration and Process Automation',
                                    'Linux Server Administration and MySQL Optimization',
                                ].map((text) => (
                                    <motion.li key={text} variants={itemVariants}>
                                        {text}
                                    </motion.li>
                                ))}
                            </ul>
                            <motion.p className="mt-6" variants={itemVariants}>
                                I am passionate about innovation, continuous improvement, and delivering solutions that drive
                                business success. Currently, I am leading the IT department at Smartcon GmbH, focusing on advancing
                                our IT infrastructure and mentoring a talented team of developers.
                            </motion.p>
                        </div>
                    </motion.div>
                </section>
            </div>
        </>
    );
};

export default Home;
