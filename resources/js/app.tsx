import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Handle flash messages from Laravel
        if (props.initialPage.props.flash) {
            const { warning, status, success, error } = props.initialPage.props.flash;

            if (warning) toast.warning(warning);
            if (status) toast.info(status);
            if (success) toast.success(success);
            if (error) toast.error(error);
        }

        root.render(
            <>
                <App {...props} />
                <Toaster position="top-right" />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
