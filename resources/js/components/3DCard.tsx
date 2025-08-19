import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@lib/utils';

export type ThreeDCardProps = {
    /** Foreground image URL (appears as main content) */
    image: string;
    /** Optional title shown in the card content */
    title?: string;
    /** Optional description shown in the card content */
    description?: string;
    /** Optional link (URL) shown in the card content */
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
 * - Normal: shows the image; no content visible.
 * - Active (hover/click): shows the image with card information overlay.
 *
 * Notes:
 * - Uses CSS perspective, translate3d, rotateX and scale for 3D effect
 * - For click trigger, the card is a button-like region with keyboard support (Enter/Space).
 */
const ThreeDCard: FC<ThreeDCardProps> = ({ image, title, description, link, trigger = 'hover', className, width = 360, height = 220 }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [active, setActive] = useState(false);

    const hasContent = useMemo(() => !!(title || description || link), [title, description, link]);

    // Event callbacks
    const onPointerLeave = useCallback(() => {
        if (trigger === 'hover') setActive(false);
    }, [trigger]);

    const onPointerEnter = useCallback(() => {
        if (trigger === 'hover') {
            setActive(true);
        }
    }, [trigger]);

    const onClick = useCallback(() => {
        if (trigger === 'click') {
            setActive((v) => !v);
        }
    }, [trigger]);

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (trigger !== 'click') return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive((v) => !v);
            }
        },
        [trigger],
    );

    return (
        <div className={cn('relative select-none', className ?? '')}>
            <div
                ref={containerRef}
                role={trigger === 'click' ? 'button' : undefined}
                aria-pressed={trigger === 'click' ? active : undefined}
                aria-expanded={trigger === 'click' ? (hasContent ? active : undefined) : undefined}
                tabIndex={trigger === 'click' ? 0 : -1}
                onKeyDown={onKeyDown}
                onClick={onClick}
                onPointerLeave={onPointerLeave}
                onPointerEnter={onPointerEnter}
                className={`group h-full w-full cursor-pointer overflow-hidden rounded-2xl border-2 bg-white/10 shadow-[0_70px_40px_-20px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out outline-none dark:bg-black/20`}
                style={{
                    width: `${width}px`,
                    maxWidth: `${width}px`,
                    height: `${height}px`,
                    transform: active ? 'translate3d(0px, 0px, -300px)' : 'perspective(750px) translate3d(0px, 0px, 0px) rotateX(27deg) scale(0.9, 0.9)',
                }}
            >
                {/* Main card content */}
                <div className="relative h-full w-full">
                    {/* Image layer */}
                    <div className="absolute inset-0 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${image})` }} />

                    {/* Card content overlay - visible on hover/click */}
                    <AnimatePresence>
                        {active && hasContent && (
                            <motion.div
                                key="content"
                                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/10 dark:bg-black/60 p-4 backdrop-blur"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {title && title.trim().length > 0 && (
                                    <motion.h3
                                        className="text-lg font-semibold text-gray-600 dark:text-gray-100 drop-shadow-sm"
                                        initial={{ y: -8, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1, duration: 0.3 }}
                                    >
                                        {title}
                                    </motion.h3>
                                )}
                                {description && description.trim().length > 0 && (
                                    <motion.p
                                        className="text-center text-sm text-gray-600 dark:text-gray-100 "
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
                                        className="mt-1 inline-flex w-fit items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-100  backdrop-blur transition hover:bg-white/20"
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ThreeDCard;
