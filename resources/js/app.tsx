import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from '@hooks/use-appearance';
import { Toaster } from '@components/ui/sonner';
import { toast } from 'sonner';
import { FlashMessages } from '@/types';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster position="top-right" />
            </>
        );

        // Handle flash messages from Laravel after render
        const flash = props.initialPage.props.flash as FlashMessages | undefined;
        if (flash) {
            setTimeout(() => {
                if (flash.warning) toast.warning(flash.warning);
                if (flash.status) toast.info(flash.status);
                if (flash.success) toast.success(flash.success);
                if (flash.error) toast.error(flash.error);
            }, 100);
        }
    },
    progress: {
        color: '#4B5563',
    },
}).then(() => {});

// This will set light / dark mode on load...
initializeTheme();
