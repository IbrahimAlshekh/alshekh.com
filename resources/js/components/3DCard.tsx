import React, { FC, useCallback, useMemo, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export type ThreeDCardProps = {
    /** Background image URL (fills the card) */
    backgroundImage: string;
    /** Foreground image URL (appears floating above with shadow) */
    image: string;
    /** Optional title shown in the reveal panel */
    title?: string;
    /** Optional description shown in the reveal panel */
    description?: string;
    /** Optional link (URL) shown in the reveal panel */
    link?: string;
    /** Interaction trigger: hover or click (default: hover) */
    trigger?: 'hover' | 'click';
    /** Optional className for outer container */
    className?: string;
    /** Optional sizes */
    width?: number | string;
    height?: number | string;
};

/**
 * 3DCard
 *
 * Behavior:
 * - Normal: shows background with a floating foreground image; no content visible.
 * - Active (hover/click): applies 3D tilt, foreground lifts with shadow, and a panel slides down as if from behind showing optional title/description/link.
 *
 * Notes:
 * - Uses CSS perspective on the wrapper and preserve-3d on the card.
 * - For click trigger, the card is a button-like region with keyboard support (Enter/Space).
 */
const ThreeDCard: FC<ThreeDCardProps> = ({
    backgroundImage,
    image,
    title,
    description,
    link,
    trigger = 'hover',
    className,
    width = 360,
    height = 220,
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const px = useMotionValue(0);
    const py = useMotionValue(0);

    const spx = useSpring(px, { stiffness: 200, damping: 30, mass: 0.3 });
    const spy = useSpring(py, { stiffness: 200, damping: 30, mass: 0.3 });

    // Map pointer to rotation angles
    const rotateY = useTransform(spx, [-0.5, 0, 0.5], [-10, 0, 10]);
    const rotateX = useTransform(spy, [-0.5, 0, 0.5], [8, 0, -8]);

    const [active, setActive] = useState(false);

    const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width; // 0..1
        const y = (e.clientY - rect.top) / rect.height; // 0..1
        px.set(x - 0.5);
        py.set(y - 0.5);
    }, [px, py]);

    const onPointerLeave = useCallback(() => {
        px.set(0);
        py.set(0);
        if (trigger === 'hover') setActive(false);
    }, [px, py, trigger]);


    const hasPanel = useMemo(() => !!(title || description || link), [title, description, link]);

    const panelContentRef = useRef<HTMLDivElement | null>(null);
    const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');

    const recalcPlacement = useCallback(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const below = window.innerHeight - rect.bottom;
        const above = rect.top;
        const estimated = panelContentRef.current?.offsetHeight ?? 180;
        const gap = 8;
        if (below >= estimated + gap) {
            setPlacement('bottom');
        } else if (above >= estimated + gap) {
            setPlacement('top');
        } else {
            setPlacement('bottom');
        }
    }, []);

    // Recalculate when activated so panel has layout
    useLayoutEffect(() => {
        if (active && hasPanel) {
            recalcPlacement();
        }
    }, [active, hasPanel, recalcPlacement]);

    // Update on resize/scroll while active
    useEffect(() => {
        if (!(active && hasPanel)) return;
        const handler = () => recalcPlacement();
        window.addEventListener('resize', handler);
        window.addEventListener('scroll', handler, { passive: true });
        return () => {
            window.removeEventListener('resize', handler);
            window.removeEventListener('scroll', handler);
        };
    }, [active, hasPanel, recalcPlacement]);

    // Event callbacks (defined after recalcPlacement to avoid TDZ)
    const onPointerEnter = useCallback(() => {
        if (trigger === 'hover') {
            setActive(true);
            recalcPlacement();
        }
    }, [trigger, recalcPlacement]);

    const onClick = useCallback(() => {
        if (trigger === 'click')
            setActive((v) => {
                const next = !v;
                if (next) recalcPlacement();
                return next;
            });
    }, [trigger, recalcPlacement]);

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (trigger !== 'click') return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActive((v) => {
                const next = !v;
                if (next) recalcPlacement();
                return next;
            });
        }
    }, [trigger, recalcPlacement]);

    // Foreground image depth
    const fgZ = useTransform(spx, [ -0.5, 0, 0.5 ], [ 24, 36, 24 ]);

    const wrapperStyle: React.CSSProperties = useMemo(() => ({
        width: `${width}px`,
        maxWidth: `${width}px`,
        height: `${height}px`,
    }), [width, height]);

    return (
        <div
            className={[
                'relative select-none',
                'will-change-transform',
                'transition-shadow',
                active ? 'drop-shadow-2xl' : 'drop-shadow-md',
                active ? 'z-[999]' : 'z-auto',
                className ?? '',
            ].join(' ')}
            style={wrapperStyle}
        >
            <div
                ref={containerRef}
                role={trigger === 'click' ? 'button' : undefined}
                aria-pressed={trigger === 'click' ? active : undefined}
                aria-expanded={trigger === 'click' ? (hasPanel ? active : undefined) : undefined}
                tabIndex={trigger === 'click' ? 0 : -1}
                onKeyDown={onKeyDown}
                onClick={onClick}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerEnter={onPointerEnter}
                className="group h-full w-full cursor-pointer outline-none"
                style={{ perspective: 1000 }}
            >
                {/* Card base with 3D tilt */}
                <motion.div
                    className="relative h-full w-full overflow-visible rounded-2xl"
                    style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                    animate={active ? { scale: 1.02 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 0.6 }}
                >
                    {/* Background layer */}
                    <motion.div
                        className="absolute inset-0 rounded-4xl bg-center bg-no-repeat bg-contain"
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                            boxShadow: active ? '0 25px 60px -20px rgba(0,0,0,0.4)' : '0 10px 25px -10px rgba(0,0,0,0.25)',
                            transform: 'translateZ(0px)',
                        }}
                    />

                    {/* Foreground floating image */}
                    <motion.img
                        src={image}
                        alt=""
                        className="pointer-events-none absolute left-1/2 top-1/2 w-[70%] h-auto -translate-x-1/2 -translate-y-1/2 rounded-xl object-contain"
                        style={{
                            transformStyle: 'preserve-3d',
                            translateZ: fgZ,
                            filter: active ? 'drop-shadow(0 0px 30px rgba(0,0,0,0.40))' : 'drop-shadow(0 10px 15px rgba(0,0,0,0.25))',
                        }}
                        initial={{ opacity: 0.95 }}
                        animate={active ? { scale: 1.15, opacity: 1 } : { scale: 1, opacity: 0.95 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 2 }}
                    />

                    {/* Reveal panel - slides down as if from behind */}
                    <AnimatePresence>
                        {active && hasPanel && (
                            <motion.div
                                key="reveal"
                                className={`absolute ${placement === 'bottom' ? 'bottom-0' : 'top-0'} left-0 right-0 z-[9999]`}
                                style={{ transformStyle: 'preserve-3d' }}
                                initial={{ opacity: 0, y: placement === 'bottom' ? '120%' : '-120%', translateZ: 12 }}
                                animate={{ opacity: 1, y: placement === 'bottom' ? '105%' : '-105%', translateZ: 12 }}
                                exit={{ opacity: 0, y: placement === 'bottom' ? '120%' : '-120%', translateZ: 12 }}
                                transition={{ type: 'spring', stiffness: 180, damping: 22, mass: 0.7 }}
                            >
                                {/* Panel content outside the frame (measured for placement decision) */}
                                <div className="relative w-full overflow-visible rounded-2xl">
                                    <motion.div
                                        ref={panelContentRef}
                                        className="relative w-full rounded-2xl bg-white/10 p-4 shadow-xl backdrop-blur-md dark:bg-black/60 border border-white/20"
                                        initial={{ clipPath: 'inset(0 0 100% 0 round 16px)' }}
                                        animate={{ clipPath: 'inset(0 0 0% 0 round 16px)' }}
                                        exit={{ clipPath: 'inset(0 0 100% 0 round 16px)' }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ border: '1px solid rgba(255,255,255,0.18)' }}
                                    >
                                        <div className="flex w-full flex-col gap-2">
                                            {title && title.trim().length > 0 && (
                                                <motion.h3
                                                    className="text-lg font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]"
                                                    initial={{ y: -8, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.1, duration: 0.3 }}
                                                >
                                                    {title}
                                                </motion.h3>
                                            )}
                                            {description && description.trim().length > 0 && (
                                                <motion.p
                                                    className="text-sm text-white/90"
                                                    initial={{ y: -6, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.16, duration: 0.3 }}
                                                >
                                                    {description}
                                                </motion.p>
                                            )}
                                            {link && link.trim().length > 0 && (
                                                <motion.a
                                                    href={link}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                    className="mt-1 inline-flex w-fit items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                                                    initial={{ y: -4, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.22, duration: 0.25 }}
                                                >
                                                    <span>Learn more</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        className="h-3.5 w-3.5"
                                                    >
                                                        <path d="M7 17L17 7" />
                                                        <path d="M7 7h10v10" />
                                                    </svg>
                                                </motion.a>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default ThreeDCard;
