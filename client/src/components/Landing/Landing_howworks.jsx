import React from 'react'
import { Card } from '../ui/card'
import { Eye, Search, Trophy } from 'lucide-react'


const arr = [{
    step: '01',
    title: 'Search Problem',
    description: 'Type any DSA problem name or topic in our smart search',
    icon: Search,
    color: 'orange'
},
{
    step: '02',
    title: 'Watch Visualization',
    description: 'See the algorithm execute step-by-step with visual animations',
    icon: Eye,
    color: 'orange'
},
{
    step: '03',
    title: 'Understand & Practice',
    description: 'Learn the pattern, understand the logic, and ace your interviews',
    icon: Trophy,
    color: 'orange'
}]

const Landing_howworks = () => {
    return (
        <>
            <section className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        How <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">DSA-DUDE</span> Works
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
                        Three simple steps to master any DSA problem
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {arr.map((item, index) => (
                        <Card
                            key={index}
                            className="relative bg-card border-border backdrop-blur-xl p-6 md:p-8 hover:transform hover:scale-[1.02] transition-all duration-300 group overflow-hidden"
                        >
                            {/* Background accent */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Step indicator - refined */}
                            <div className="absolute top-4 right-4 text-6xl md:text-7xl font-black text-primary/5 group-hover:text-primary/10 transition-all duration-500 select-none">
                                {item.step}
                            </div>

                            {/* Icon container - cleaner */}
                            <div className="relative z-10 mb-6 md:mb-8">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-orange-500/30">
                                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 space-y-3 md:space-y-4">
                                <h3 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-xs md:text-sm font-light">{item.description}</p>
                            </div>

                            {/* Subtle border effect on hover */}
                            <div className="absolute inset-0 border border-transparent group-hover:border-primary/20 rounded-lg transition-all duration-300" />
                        </Card>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Landing_howworks