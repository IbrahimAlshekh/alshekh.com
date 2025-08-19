import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Github, Linkedin, Menu, X, MessageSquare } from 'lucide-react';
import ThemeToggle from '@/components/theme-toggle';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerClose,
    DrawerHeader,
    DrawerFooter,
} from '@/components/ui/drawer';

export function GuestHeader() {
    return (
        <header className="border-b sticky top-0 z-50 bg-background/50 dark:bg-black/50 backdrop-blur-xl border-border dark:border-sidebar-border/80">
            <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="flex items-center space-x-2">
                        {/*<AppLogo />*/}
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link
                        href="#tech"
                        className="text-sm font-medium text-foreground dark:text-white/90 rounded-md px-3 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        Tech Stack
                    </Link>
                    <Link
                        href="#about"
                        className="text-sm font-medium text-foreground dark:text-white/90 rounded-md px-3 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        About
                    </Link>
                    <Link
                        href="#contact"
                        className="text-sm font-medium text-foreground dark:text-white/90 rounded-md px-3 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground"
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
                                <DrawerHeader className="border-b border-border dark:border-sidebar-border/80 pb-4">
                                    <div className="flex items-center justify-between">
                                        <AppLogo />
                                        <DrawerClose asChild>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </DrawerClose>
                                    </div>
                                </DrawerHeader>

                                <div className="flex flex-col p-4 space-y-4">
                                    {/* Navigation Links */}
                                    <Link
                                        href="#tech"
                                        className="text-sm font-medium text-foreground dark:text-white/90 rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                        Tech Stack
                                    </Link>
                                    <Link
                                        href="#about"
                                        className="text-sm font-medium text-foreground dark:text-white/90 rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                        About
                                    </Link>
                                    <Link
                                        href="#contact"
                                        className="text-sm font-medium text-foreground dark:text-white/90 rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                        Contact
                                    </Link>

                                    {/* Auth Link */}
                                    {/* Theme Toggle - Mobile */}
                                    <div className="py-2 flex justify-center">
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
                                        <a href="https://github.com/ibrahimalshekh" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                                            <Github className="h-5 w-5" />
                                        </a>
                                        <a href="https://linkedin.com/in/ibrahimalshekh" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                                            <Linkedin className="h-5 w-5" />
                                        </a>
                                        <a href="https://whatsapp.com/channel/ibrahimalshekh" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
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
