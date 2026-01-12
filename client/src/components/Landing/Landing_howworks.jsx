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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {arr.map((item, index) => (
                        <Card
                            key={index}
                            className="relative bg-card/60 border-border/50 backdrop-blur-2xl p-8 hover:transform hover:scale-[1.02] transition-all duration-500 group overflow-hidden rounded-3xl"
                        >
                            {/* Step hint */}
                            <div className="absolute top-4 right-6 text-7xl font-black text-orange-500/5 group-hover:text-orange-500/10 transition-all duration-700 select-none font-mono">
                                {item.step}
                            </div>

                            {/* Icon container */}
                            <div className="relative z-10 mb-8">
                                <div className="relative w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-orange-500/20">
                                    <item.icon className="w-7 h-7 text-white" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-xl font-bold text-foreground italic">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-medium opacity-80">{item.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Landing_howworks