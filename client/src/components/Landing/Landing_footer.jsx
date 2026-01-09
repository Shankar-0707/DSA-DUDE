import { Code2 } from 'lucide-react'
import React from 'react'

const Landing_footer = () => {
  return (
    <>
     <footer className="relative z-10 border-t border-white/10 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Code2 className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                                DSA-DUDE
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm">
                            © 2026 DSA-DUDE.
                        </p>
                    </div>
                </div>
            </footer>
    </>
  )
}

export default Landing_footer