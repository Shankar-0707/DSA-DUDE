import { Code2, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

const Navbar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await API.post('/auth/logout');
            logout(); // Clear client-side state
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if backend fails, we should clear client state to be safe
            logout();
            navigate('/login');
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                {/* Left Side: Logo and Website Name */}
                <div
                    className="flex items-center gap-2 md:gap-3 cursor-pointer"
                    onClick={() => navigate('/home')}
                >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                        <Code2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent truncate tracking-tight">
                        DSA-DUDE
                    </span>
                </div>

                {/* Center: Navigation Links */}
                <div className="hidden md:flex items-center gap-6">
                    <button
                        onClick={() => navigate('/home')}
                        className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => navigate('/problems')}
                        className="text-sm font-medium text-foreground/70 hover:text-orange-500 transition-colors cursor-pointer"
                    >
                        Approaches
                    </button>
                    <button
                        onClick={() => navigate('/saved-problems')}
                        className="text-sm font-medium text-foreground/70 hover:text-orange-500 transition-colors cursor-pointer"
                    >
                        Saved
                    </button>

                     <button
                        onClick={() => navigate('/visualize')}
                        className="text-sm font-medium text-foreground/70 hover:text-orange-500 transition-colors cursor-pointer"
                    >
                        Visualize
                    </button>
                </div>

                {/* Right Side: Theme Toggle, Profile, Logout */}
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <ModeToggle />

                    {/* User Profile Viewer */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-10 h-10 hover:bg-accent/50 transition-colors"
                        title="Profile"
                        onClick={() => navigate("/profile")}
                    >
                        <User className="h-5 w-5 text-foreground/80" />
                        <span className="sr-only">Profile</span>
                    </Button>

                    {/* Logout Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex items-center gap-2 text-foreground/80 hover:text-red-500 hover:bg-red-500/10 transition-all font-medium"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>

                    {/* Mobile Logout Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="sm:hidden text-foreground/80 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="sr-only">Logout</span>
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
