import { AppFooter } from '@layouts/guest/app-footer';
import { GuestHeader } from '@layouts/guest/guest-header';
import { type ReactNode } from 'react';

interface GuestLayoutProps {
    children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <GuestHeader />
            <main className="flex-1">
                {children}
            </main>
            <AppFooter variant="header" />
        </div>
    );
}
