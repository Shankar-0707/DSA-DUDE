import { ArrowRight, Code2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { Button } from '../ui/button';

const Landing_navigation = () => {
    const navigate = useNavigate();
  return (
   <>
    <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Code2 className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        DSA-DUDE
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/50"
                        onClick={() => navigate('/LogIn')}
                    >
                        Sign In
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/50"
                        onClick={() => navigate('/SignIn')}
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