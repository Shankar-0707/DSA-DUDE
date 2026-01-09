import { Brain, Code2, Eye, Search, Trophy, Zap } from 'lucide-react';
import React from 'react'
import { Card } from '../ui/card';


const features = [
    {
        icon: Search,
        title: 'Smart Problem Search',
        description: 'Instantly find any DSA problem with our intelligent search engine',
        gradient: 'from-violet-500 to-purple-600'
    },
    {
        icon: Eye,
        title: 'Visual Dry Runs',
        description: 'Step-by-step visualization of algorithm execution',
        gradient: 'from-blue-500 to-cyan-600'
    },
    {
        icon: Code2,
        title: 'Code Walkthroughs',
        description: 'Detailed explanations of optimal solutions',
        gradient: 'from-emerald-500 to-teal-600'
    },
    {
        icon: Brain,
        title: 'Pattern Recognition',
        description: 'Learn to identify common problem patterns',
        gradient: 'from-pink-500 to-rose-600'
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
        gradient: 'from-indigo-500 to-purple-600'
    }
];

const Landing_Features = () => {
    return (
        <>
            <section className="relative z-10 container mx-auto px-6 py-8">
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Powerful Features for{' '}
                        <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                            Faster Learning
                        </span>
                    </h2>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Everything you need to become a DSA expert
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="bg-white/5 border-white/10 backdrop-blur-md p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                        >
                            <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                            <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Landing_Features