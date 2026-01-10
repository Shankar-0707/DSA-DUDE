import { ArrowRight, Code2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { Button } from '../ui/button';
import { ModeToggle } from '../mode-toggle';

const Landing_navigation = () => {
    const navigate = useNavigate();
    return (
        <>
            <nav className="relative z-10 container mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between transition-all">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shrink-0">
                        <Code2 className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent truncate">
                        DSA-DUDE
                    </span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <ModeToggle />
                    <Button
                        variant="ghost"
                        className="hidden sm:flex text-foreground hover:bg-accent/50"
                        onClick={() => navigate('/Login')}
                    >
                        Sign In
                    </Button>
                    <Button
                        size="sm"
                        className="md:hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 text-xs px-3"
                        onClick={() => navigate('/SignIn')}
                    >
                        Start
                        <ArrowRight className="ml-1 w-3 h-3" />
                    </Button>
                    <Button
                        className="hidden md:flex bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/50"
                        onClick={() => navigate('/signup')}
                    >
                        Get Started
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </nav>
        </>
    )
}

export default Landing_navigation