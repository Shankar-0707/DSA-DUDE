import { Code2 } from 'lucide-react'
import React from 'react'

const Landing_footer = () => {
    return (
        <>
            <footer className="relative z-10 border-t border-border backdrop-blur-sm">
                <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <Code2 className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                                DSA-DUDE
                            </span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
                            <p className="text-muted-foreground text-xs md:text-sm order-2 md:order-1">
                                © 2026 DSA-DUDE. Built for champions.
                            </p>
                            <div className="flex items-center gap-6 text-xs md:text-sm text-muted-foreground order-1 md:order-2">
                                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                                <a href="#" className="hover:text-primary transition-colors">Support</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Landing_footer