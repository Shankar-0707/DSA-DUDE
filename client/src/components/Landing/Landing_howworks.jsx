import React from 'react'
import { Card } from '../ui/card'
import { Eye, Search, Trophy } from 'lucide-react'


const arr = [{
    step: '01',
    title: 'Search Problem',
    description: 'Type any DSA problem name or topic in our smart search',
    icon: Search,
    color: 'violet'
},
{
    step: '02',
    title: 'Watch Visualization',
    description: 'See the algorithm execute step-by-step with visual animations',
    icon: Eye,
    color: 'purple'
},
{
    step: '03',
    title: 'Understand & Practice',
    description: 'Learn the pattern, understand the logic, and ace your interviews',
    icon: Trophy,
    color: 'pink'
}]

const Landing_howworks = () => {
    return (
        <>
            <section className="relative z-10 container mx-auto px-6 py-8">
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        How <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">DSA-DUDE</span> Works
                    </h2>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Three simple steps to master any DSA problem
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {arr.map((item, index) => (
                        <Card
                            key={index}
                            className="relative bg-gradient-to-br from-white/5 to-white/10 border border-white/15 backdrop-blur-xl p-8 hover:transform hover:scale-[1.02] transition-all duration-300 group overflow-hidden"
                        >
                            {/* Background accent */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Step indicator - refined */}
                            <div className={`absolute top-4 right-4 text-7xl font-black text-${item.color}-500/5 group-hover:text-${item.color}-500/10 transition-all duration-500`}>
                                {item.step}
                            </div>

                            {/* Icon container - cleaner */}
                            <div className="relative z-10 mb-8">
                                <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className={`relative w-14 h-14 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-${item.color}-500/30`}>
                                    <item.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-xl font-semibold text-white tracking-tight">{item.title}</h3>
                                <p className="text-slate-300/90 leading-relaxed text-sm font-light">{item.description}</p>
                            </div>

                            {/* Subtle border effect on hover */}
                            <div className="absolute inset-0 border border-transparent group-hover:border-white/10 rounded-lg transition-all duration-300" />
                        </Card>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Landing_howworks