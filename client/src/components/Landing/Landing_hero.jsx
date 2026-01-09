import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Play, Sparkles, Target, Users } from 'lucide-react';
import { Card } from '../ui/card';


const stats = [
    { number: '500+', label: 'DSA Problems', icon: BookOpen },
    { number: '10K+', label: 'Active Users', icon: Users },
    { number: '95%', label: 'Success Rate', icon: Target },
    { number: '24/7', label: 'Available', icon: Sparkles }
];


const Landing_hero = () => {
    const navigate = useNavigate();

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <>
            <section className="relative z-10 container mx-auto px-6 pt-20 pb-12">
                <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>


                    <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                        Visualize. Learn.{' '}
                        <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Conquer DSA
                        </span>
                    </h1>

                    <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Transform complex algorithms into intuitive visual experiences.
                        Search any DSA problem and get instant step-by-step visualizations and dry runs.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-2xl shadow-purple-500/50 group"
                            onClick={() => navigate('/home')}
                        >
                            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                            Start Visualizing
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-purple-400/50 text-white hover:bg-purple-500/20 px-8 py-6 text-lg backdrop-blur-sm"
                        >
                            <BookOpen className="mr-2 w-5 h-5" />
                            Explore Problems
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <Card
                                key={index}
                                className="bg-white/5 border-white/10 backdrop-blur-md p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                            >
                                <stat.icon className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
                                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                                <div className="text-sm text-slate-400">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Landing_hero