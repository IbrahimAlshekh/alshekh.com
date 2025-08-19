import { Facebook, Github, Globe, Linkedin, Megaphone, Send, Twitter } from 'lucide-react';
import type { IconType } from '@/types/app';

export type SocialItem = {
    href: string;
    label: string;
    Icon: IconType;
};

export const socialLinks: SocialItem[] = [
    { href: 'https://github.com/IbrahimAlshekh/alshekh.com', label: 'GitHub', Icon: Github },
    { href: 'https://x.com/IbrahimAlshekh_', label: 'X (Twitter)', Icon: Twitter },
    { href: 'https://www.facebook.com/Ibrahim0Alshekh/', label: 'Facebook', Icon: Facebook },
    { href: 'https://www.linkedin.com/in/ibrahim-shekh-mohammed-0275b5152/', label: 'LinkedIn', Icon: Linkedin },
    { href: 'https://qabilah.com/profile/ibrahimalshekh', label: 'Qabilah.com', Icon: Globe },
    { href: 'https://t.me/ibrahim_alshekh', label: 'Telegram', Icon: Send },
    { href: 'https://whatsapp.com/channel/0029VbAtsF62kNFkMAFBBJ06', label: 'WhatsApp Channel', Icon: Megaphone },
] as const;
