import { motion } from 'motion/react';
import React, { FC } from 'react';
import { IconType } from '@/types/app';

interface SocialLinkProps {
    href: string;
    label: string;
    Icon: IconType;
}

const SocialLink: FC<{ href: string; label: string; Icon: IconType }> = ({ href, label, Icon }: SocialLinkProps) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={label}
        className="group inline-flex items-center gap-2 rounded-lg border border-border/40 dark:border-white/10 bg-card/40 dark:bg-white/5 px-4 py-2 text-sm font-medium text-foreground/90 dark:text-white/90 shadow-sm backdrop-blur transition hover:bg-card/60 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white focus-visible:ring-2 focus-visible:ring-border/60 dark:focus-visible:ring-white/40 focus-visible:outline-none"
        whileHover={{ y: -2, scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
    >
        <Icon className="h-4 w-4 text-foreground/80 dark:text-white/80 transition group-hover:scale-110 group-hover:text-foreground dark:group-hover:text-white" />
        <span className="hidden sm:inline text-grey-600">{label}</span>
    </motion.a>
);

export default SocialLink;
