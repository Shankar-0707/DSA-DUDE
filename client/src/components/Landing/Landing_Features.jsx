import { Brain, Code2, Eye, Search, Trophy, Zap } from 'lucide-react';
import React from 'react'
import { Card } from '../ui/card';


const features = [
    {
        icon: Search,
        title: 'Smart Problem Search',
        description: 'Instantly find any DSA problem with our intelligent search engine',
        gradient: 'from-orange-500 to-orange-600'
    },
    {
        icon: Eye,
        title: 'Visual Dry Runs',
        description: 'Step-by-step visualization of algorithm execution',
        gradient: 'from-amber-500 to-orange-600'
    },
    {
        icon: Code2,
        title: 'Code Walkthroughs',
        description: 'Detailed explanations of optimal solutions',
        gradient: 'from-yellow-500 to-amber-600'
    },
    {
        icon: Brain,
        title: 'Pattern Recognition',
        description: 'Learn to identify common problem patterns',
        gradient: 'from-orange-400 to-orange-500'
    },
    {
        icon: Zap,
        title: 'Quick Learning',
        description: 'Master complex algorithms faster with visual aids',
        gradient: 'from-orange-500 to-amber-600'
    },
    {
        icon: Trophy,
        title: 'Track Progress',
        description: 'Monitor your DSA journey and achievements',
        gradient: 'from-orange-600 to-orange-700'
    }
];

const Landing_Features = () => {
    return (
        <>
            <section className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        Powerful Features for{' '}
                        <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent block sm:inline">
                            Faster Learning
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
                        Everything you need to become a DSA expert
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="bg-card/40 border-border/50 backdrop-blur-xl p-8 hover:bg-muted/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/5 group rounded-3xl"
                        >
                            <div className={`w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/5`}>
                                <feature.icon className="w-7 h-7 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground italic">{feature.title}</h3>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Landing_Features