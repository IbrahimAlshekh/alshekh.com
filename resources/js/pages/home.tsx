import { Head } from '@inertiajs/react';
import { type FC } from 'react';
import { motion } from 'motion/react';
import ThreeDCard from '@/components/3DCard';
import SocialLink from '@/components/SocialLink';
import GradualSpacing from '@/components/GradualSpacing';
import { stack } from '@/data/stack';
import { socialLinks } from '@/data/socialLinks';
import { cards } from '@/data/featureCards';
import GuestLayout from '@layouts/guest-layout';

const Home: FC = () => {

    // Variants for scroll-reveal
    const containerVariants = {
        hidden: { opacity: 0, y: 16 },
        show: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    } as const;

    const itemVariants = {
        hidden: { opacity: 0, y: 5, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1 },
    } as const;

    return (
        <GuestLayout>
            <Head title="Ibrahim Alshekh" />

            {/* Background */}
            <div className="overflow-hidden bg-background dark:bg-neutral-950 text-foreground dark:text-white">
                {/* Animated gradient orbs with subtle parallax + mouse drift */}
                <motion.div
                    className="pointer-events-none fixed -right-1/4 -bottom-1/4 h-[70vh] w-[50vh] animate-[spin_14s_linear_infinite_reverse] rounded-full bg-[conic-gradient(at_bottom_right,_#f97316,_#ef4444,_#eab308,_#f97316)] opacity-20 blur-3xl"
                    aria-hidden
                />
                {/* Extra orbs for richness */}
                <motion.div
                    className="pointer-events-none fixed -top-80 right-0 h-[45vh] w-[25vh] animate-[spin_30s_linear_infinite] rounded-full bg-[conic-gradient(at_top_right,_#22c55e,_#06b6d4,_#0ea5e9,_#22c55e)] opacity-15 blur-3xl"
                    aria-hidden
                />
                <motion.div
                    className="pointer-events-none fixed -left-32 top-1/2 h-[36vh] w-[56vh] animate-[spin_30s_linear_infinite_reverse] rounded-full bg-[conic-gradient(at_left,_#a78bfa,_#22d3ee,_#38bdf8,_#a78bfa)] opacity-10 blur-3xl"
                    aria-hidden
                />
                <motion.div
                    className="pointer-events-none fixed top-1/4 left-1/2 h-[28vh] w-[48vh] animate-[spin_30s_linear_infinite] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(at_center,_#eab308,_#f97316,_#ef4444,_#eab308)] opacity-10 blur-3xl"
                    aria-hidden
                />

                {/* Hero */}
                <motion.main
                    id="top"
                    className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-24 text-center"

                >
                    <GradualSpacing text="Ibrahim Alshekh" />
                    <motion.p
                        className="mx-auto mt-4 max-w-2xl text-base text-balance text-foreground/80 dark:text-white/70 sm:text-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Fullstack Developer & IT Manager specializing in PHP/Laravel, React & TypeScript, and system integration. Currently leading IT
                        at smartcon GmbH—building high-performance apps, intuitive UIs, and mentoring teams.
                    </motion.p>

                    <motion.div
                        id="contact"
                        className="mt-10 flex flex-wrap items-center justify-center gap-3"
                        initial="hidden"
                        animate="show"
                        variants={containerVariants}
                    >
                        {socialLinks.map(({ href, label, Icon }) => (
                            <motion.div key={label} variants={itemVariants}>
                                <SocialLink href={href} label={label} Icon={Icon} />
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="mx-auto mt-40 flex flex-wrap items-center justify-center gap-4"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        {cards.map(({ image, title, description }) => (
                            <motion.div key={title} variants={itemVariants}>
                                <ThreeDCard
                                    width="260"
                                    height={260}
                                    image={image}
                                    title={title}
                                    description={description}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                </motion.main>

                {/* Tech Stack Section */}
                <section id="tech" className="relative mx-auto w-full max-w-4xl px-6 py-10">
                    <motion.div
                        className="rounded-2xl border border-border/40 dark:border-white/10 bg-card/40 dark:bg-white/5 p-4 shadow-sm backdrop-blur sm:p-6"
                        initial="hidden"
                        whileInView="show"
                        variants={containerVariants}
                    >
                        <div className="mb-2 inline-flex items-censter gap-2 rounded-full border border-border/40 dark:border-white/10 bg-card/30 dark:bg-white/5 px-3 py-1 text-xs text-foreground/70 dark:text-white/70">
                            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                            <span>My Tech Stack</span>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-foreground/70 dark:text-white/70">
                            My preferred toolkit — full‑stack balance with backend muscle and frontend finesse. Laravel + PostgreSQL power the core,
                            Inertia keeps the bridge seamless, and React + TypeScript + Tailwind craft fast, elegant UIs. It covers most product
                            use‑cases without extra baggage.
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                            {stack.map(({ name, logo, classes, dot }, idx) => (
                                <motion.span
                                    key={name}
                                    className={`group inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm shadow-sm backdrop-blur transition ${classes}`}
                                    variants={itemVariants}
                                    custom={idx}
                                    whileHover={{ scale: 1.2 }}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                                   <img src={logo} alt={`${name} logo`} className="h-4 w-4" />
                                    <span className="font-medium text-gray-600 dark:text-gray-100">{name}</span>
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* About / Description Section */}
                <section id="about" className="relative mx-auto w-full max-w-4xl px-6 py-16">
                    <motion.div
                        className="rounded-2xl border border-border/40 dark:border-white/10 bg-card/40 dark:bg-white/5 p-6 shadow-sm backdrop-blur sm:p-8"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.25 }}
                        variants={containerVariants}
                    >
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/40 dark:border-white/10 bg-card/30 dark:bg-white/5 px-3 py-1 text-xs text-foreground/70 dark:text-white/70">
                            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                            <span>About me</span>
                        </div>
                        <motion.h2 className="text-2xl font-semibold text-balance text-foreground dark:text-white sm:text-3xl" variants={itemVariants}>
                            Fullstack Developer & IT Manager with Expertise in PHP, Laravel, and Frontend Technologies
                        </motion.h2>
                        <div className="prose dark:prose-invert mt-4 max-w-none text-foreground/80 dark:text-white/80">
                            <motion.p variants={itemVariants}>
                                I am an experienced Fullstack Developer and IT Manager with a strong background in software development, project
                                management, and team leadership. I have a deep knowledge of both backend and frontend technologies, specializing in
                                PHP, Laravel, React (Next.js), Vue.js, and Livewire. With several years of experience, I have successfully led complex
                                IT projects from conception to deployment, focusing on creating high-performance applications, intuitive UI/UX
                                designs, and integrating systems to optimize processes.
                            </motion.p>
                            <motion.p variants={itemVariants}>
                                Throughout my career, I have been responsible for managing IT departments, training team members, and ensuring the
                                smooth operation of systems. I’ve also contributed to the development of survey software, live dashboards for
                                real-time analysis, and automated workflows using Python. My ability to work under pressure, attention to detail, and
                                clear communication have allowed me to consistently achieve excellent results.
                            </motion.p>
                            <motion.h3 className="mt-8 text-xl font-semibold text-foreground dark:text-white" variants={itemVariants}>
                                Key areas of expertise:
                            </motion.h3>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground/85 dark:text-white/85">
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
                            <motion.p className="mt-6 text-foreground/80 dark:text-white/80" variants={itemVariants}>
                                I am passionate about innovation, continuous improvement, and delivering solutions that drive business success.
                                Currently, I am leading the IT department at Smartcon GmbH, focusing on advancing our IT infrastructure and mentoring
                                a talented team of developers.
                            </motion.p>
                        </div>
                    </motion.div>
                </section>
            </div>
        </GuestLayout>
    );
};

export default Home;
