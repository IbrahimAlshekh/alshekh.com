import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { cn } from '@lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { Github, Heart, Send } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface AppFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'header' | 'sidebar';
}


export function AppFooter({ variant = 'header', className, ...props }: AppFooterProps) {
    const [subscribed, setSubscribed] = useState(false);

    const form = useForm({
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post(route('newsletter.subscribe'), {
            preserveState: true,
            onSuccess: () => {
                setSubscribed(true);
                toast.success('Thank you for subscribing to our newsletter!');
                form.reset();
            },
            onError: (errors) => {
                if (errors.email) {
                    toast.error(errors.email);
                } else {
                    toast.error('An error occurred while processing your subscription.');
                }
            }
        });
    };

    return (
        <footer
            className={cn(
                "border-t border-sidebar-border/80 bg-background py-8 mt-auto",
                variant === 'sidebar' ? 'w-full' : '',
                className
            )}
            {...props}
        >
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:flex-row md:justify-between md:gap-12">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">Ibrahim Alshekh</h3>
                    <p className="max-w-md text-sm text-muted-foreground">
                        A passionate developer building with Laravel, React, and modern web technologies.
                        Sharing knowledge and open-source contributions to help the community grow.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                        <a
                            href="https://github.com/IbrahimAlshekh/alshekh.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-primary"
                        >
                            <Github className="h-4 w-4" />
                            <span>View Source</span>
                        </a>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">Newsletter</h3>
                    <p className="max-w-md text-sm text-muted-foreground">
                        Subscribe to get updates on new articles, projects, and tech insights.
                    </p>

                    {subscribed ? (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <Heart className="h-4 w-4" />
                            <span>Thanks for subscribing!</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-2 flex max-w-md flex-col gap-2">
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="max-w-xs"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    required
                                    disabled={form.processing}
                                />
                                <Button type="submit" size="sm" disabled={form.processing}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Subscribe
                                </Button>
                            </div>
                            {form.errors.email && (
                                <p className="text-sm text-red-500">{form.errors.email}</p>
                            )}
                        </form>
                    )}
                </div>
            </div>

            <div className="mx-auto mt-8 max-w-7xl px-4">
                <div className="flex flex-col items-center justify-between gap-4 border-t border-sidebar-border/60 pt-8 text-center text-sm text-muted-foreground md:flex-row md:text-left">
                    <p>© {new Date().getFullYear()} Ibrahim Alshekh. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
