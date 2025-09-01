import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Github, Linkedin, Menu, MessageSquare, X } from 'lucide-react';
import ThemeToggle from '@/components/theme-toggle';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer';

export function GuestHeader() {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/50 backdrop-blur-xl dark:border-sidebar-border/80 dark:bg-black/50">
            <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <AppLogo />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden items-center space-x-6 md:flex">
                    <Link
                        href="#tech"
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground dark:text-white/90"
                    >
                        Tech Stack
                    </Link>
                    <Link
                        href="#about"
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground dark:text-white/90"
                    >
                        About
                    </Link>
                    <Link
                        href="#contact"
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground dark:text-white/90"
                    >
                        Contact
                    </Link>
                </nav>

                <div className="flex items-center space-x-4">
                    {/* Theme Toggle - Desktop */}
                    <div className="hidden md:block">
                        <ThemeToggle />
                    </div>

                    {/* Desktop Login Button */}
                    {/*<Link href={route('login')} className="hidden md:flex cursor-pointer">*/}
                    {/*    <Button variant="outline" size="sm">*/}
                    {/*        Login*/}
                    {/*    </Button>*/}
                    {/*</Link>*/}

                    {/* Mobile Drawer */}
                    <div className="md:hidden">
                        <Drawer direction="right">
                            <DrawerTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className="bg-background text-foreground dark:bg-black dark:text-white">
                                <DrawerHeader className="border-b border-border pb-4 dark:border-sidebar-border/80">
                                    <div className="flex items-center justify-between">
                                        <AppLogo />
                                        <DrawerClose asChild>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </DrawerClose>
                                    </div>
                                </DrawerHeader>

                                <div className="flex flex-col space-y-4 p-4">
                                    {/* Navigation Links */}
                                    <Link
                                        href="#tech"
                                        className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground dark:text-white/90"
                                    >
                                        Tech Stack
                                    </Link>
                                    <Link
                                        href="#about"
                                        className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground dark:text-white/90"
                                    >
                                        About
                                    </Link>
                                    <Link
                                        href="#contact"
                                        className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground dark:text-white/90"
                                    >
                                        Contact
                                    </Link>

                                    {/* Auth Link */}
                                    {/* Theme Toggle - Mobile */}
                                    <div className="flex justify-center py-2">
                                        <ThemeToggle />
                                    </div>

                                    {/*<Link*/}
                                    {/*    href={route('login')}*/}
                                    {/*    className="w-full py-2"*/}
                                    {/*>*/}
                                    {/*<Button variant="outline" size="sm" className="w-full">*/}
                                    {/*    Login*/}
                                    {/*</Button>*/}
                                    {/*</Link>*/}
                                </div>

                                <DrawerFooter className="border-t border-border dark:border-sidebar-border/80">
                                    <div className="flex justify-center space-x-4 py-2">
                                        <a
                                            href="https://github.com/ibrahimalshekh"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <Github className="h-5 w-5" />
                                        </a>
                                        <a
                                            href="https://linkedin.com/in/ibrahimalshekh"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <Linkedin className="h-5 w-5" />
                                        </a>
                                        <a
                                            href="https://whatsapp.com/channel/ibrahimalshekh"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <MessageSquare className="h-5 w-5" />
                                        </a>
                                    </div>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    </div>
                </div>
            </div>
        </header>
    );
}
