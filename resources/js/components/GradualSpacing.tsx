import React, { FC, useRef } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';

interface GradualSpacingProps {
    text: string;
    className?: string;
}

const GradualSpacing: FC<{ text: string; className?: string }> = ({ text, className }: GradualSpacingProps) => {
    const ref = useRef<HTMLParagraphElement | null>(null);
    const isInView = useInView(ref, { once: true });
    return (
        <div className="flex justify-center">
            <AnimatePresence>
                {text.split('').map((char, i) => (
                    <motion.p
                        // Attach the inView ref to the first letter element
                        ref={i === 0 ? ref : undefined}
                        key={`${char}-${i}`}
                        initial={{ opacity: 0, x: -18 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        className={[
                            'text-center font-bold tracking-tighter',
                            // Default sizes, can be overridden via className
                            'text-3xl sm:text-5xl md:text-6xl md:leading-[4rem]',
                            className ?? '',
                        ].join(' ')}
                    >
                        {char === ' ' ? <span>&nbsp;</span> : char}
                    </motion.p>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default GradualSpacing;
