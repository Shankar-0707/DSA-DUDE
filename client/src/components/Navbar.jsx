import { Code2, LogOut, User, Menu, X, ChevronDown, Bookmark, History as HistoryIcon, LayoutGrid, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await API.post('/auth/logout');
            logout(); // Clear client-side state
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            logout();
            navigate('/login');
        }
    };

    const navLinks = [
        { name: 'Home', path: '/home' },
        {
            name: 'Approaches',
            path: '/problems',
            subItems: [
                { name: 'Select Approaches', path: '/problems', icon: LayoutGrid },
                { name: 'Saved Problems', path: '/saved-problems', icon: Bookmark }
            ]
        },
        { name: 'Visualize', path: '/visualize' },
        {
            name: 'PDF',
            path: '/documents',
            subItems: [
                { name: 'Upload PDF', path: '/documents', icon: UploadCloud },
                { name: 'History', path: '/documents/history', icon: HistoryIcon }
            ]
        },
         { name: 'Quiz', path: '/quiz' },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground transition-all">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center">
                {/* Left Section: Logo */}
                <div className="flex-1 flex justify-start overflow-hidden">
                    <div
                        className="flex items-center gap-2 md:gap-3 cursor-pointer shrink-0 group"
                        onClick={() => handleNavigate('/home')}
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Code2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent truncate tracking-tight">
                            DSA-DUDE
                        </span>
                    </div>
                </div>

                {/* Center Section: Desktop Links or Mobile Hamburger */}
                <div className="flex-none md:flex-1 flex justify-center items-center">
                    {/* Desktop Links (hidden on mobile) */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative group/nav">
                                <button
                                    onClick={() => !link.subItems && handleNavigate(link.path)}
                                    className={cn(
                                        "px-4 py-2 text-sm font-medium transition-all flex items-center gap-1.5 rounded-md hover:bg-orange-500/5",
                                        link.subItems ? "cursor-default text-foreground/70 group-hover/nav:text-orange-500" : "text-foreground/70 hover:text-orange-500 cursor-pointer"
                                    )}
                                >
                                    {link.name}
                                    {link.subItems && (
                                        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover/nav:rotate-180" />
                                    )}
                                </button>

                                {link.subItems && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 transform scale-95 group-hover/nav:scale-100 pointer-events-none group-hover/nav:pointer-events-auto">
                                        <div className="w-48 bg-card border border-border/40 rounded-xl shadow-xl overflow-hidden p-1 backdrop-blur-xl">
                                            {link.subItems.map((sub) => (
                                                <button
                                                    key={sub.path}
                                                    onClick={() => handleNavigate(sub.path)}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground/70 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-all text-left"
                                                >
                                                    <sub.icon className="w-4 h-4" />
                                                    {sub.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Menu Toggle Button (Centered on Mobile) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden w-10 h-10 text-foreground/80 hover:bg-orange-500/10 hover:text-orange-500 transition-all rounded-full"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </div>

                {/* Right Section: Actions */}
                <div className="flex-1 flex justify-end items-center gap-1 md:gap-4 shrink-0">
                    <ModeToggle />

                    {/* User Profile Viewer */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-9 h-9 md:w-10 md:h-10 hover:bg-accent/50 transition-colors"
                        title="Profile"
                        onClick={() => handleNavigate("/profile")}
                    >
                        <User className="h-5 w-5 text-foreground/80" />
                        <span className="sr-only">Profile</span>
                    </Button>

                    {/* Logout Button (Desktop) */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex items-center gap-2 text-foreground/80 hover:text-red-500 hover:bg-red-500/10 transition-all font-medium"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-x-0 top-16 z-40 md:hidden bg-background/95 backdrop-blur-xl border-b border-border/40 transition-all duration-300 ease-in-out origin-top",
                    isMenuOpen ? "opacity-100 scale-y-100 h-[calc(100vh-4rem)] overflow-y-auto py-6" : "opacity-0 scale-y-0 h-0 overflow-hidden py-0"
                )}
            >
                <div className="container mx-auto px-4 flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <div key={link.name} className="flex flex-col gap-1">
                            {link.subItems ? (
                                <>
                                    <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mt-4">
                                        {link.name}
                                    </div>
                                    {link.subItems.map((sub) => (
                                        <button
                                            key={sub.path}
                                            onClick={() => handleNavigate(sub.path)}
                                            className="flex items-center gap-4 p-4 text-lg font-medium text-foreground/80 hover:text-orange-500 hover:bg-orange-500/5 rounded-xl transition-all"
                                        >
                                            <div className="w-10 h-10 bg-orange-500/5 rounded-lg flex items-center justify-center">
                                                <sub.icon className="w-5 h-5 text-orange-500" />
                                            </div>
                                            {sub.name}
                                        </button>
                                    ))}
                                </>
                            ) : (
                                <button
                                    onClick={() => handleNavigate(link.path)}
                                    className="flex items-center gap-4 p-4 text-lg font-medium text-foreground/80 hover:text-orange-500 hover:bg-orange-500/5 rounded-xl transition-all"
                                >
                                    <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                                        {link.name === 'Home' ? <LayoutGrid className="w-5 h-5 text-foreground/50" /> : <LayoutGrid className="w-5 h-5 text-foreground/50" />}
                                    </div>
                                    {link.name}
                                </button>
                            )}
                        </div>
                    ))}
                    <div className="h-px bg-border/40 my-4" />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 p-4 text-lg font-medium text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                    >
                        <div className="w-10 h-10 bg-red-500/5 rounded-lg flex items-center justify-center">
                            <LogOut className="w-5 h-5" />
                        </div>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
