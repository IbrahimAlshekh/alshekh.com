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
        className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 shadow-sm backdrop-blur transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
        whileHover={{ y: -2, scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
    >
        <Icon className="h-4 w-4 text-white/80 transition group-hover:scale-110 group-hover:text-white" />
        <span className="hidden sm:inline">{label}</span>
    </motion.a>
);

export default SocialLink;
