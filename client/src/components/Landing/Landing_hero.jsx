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
            <section className="relative z-10 container mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-8 md:pb-12">
                <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                        Visualize. Learn.{' '}
                        <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent block sm:inline">
                            Conquer DSA
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
                        Transform complex algorithms into intuitive visual experiences.
                        Search any DSA problem and get instant step-by-step visualizations and dry runs.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-12 md:mb-16">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-5 md:py-6 text-base md:text-lg shadow-2xl shadow-orange-500/50 group"
                            onClick={() => navigate('/login')}
                        >
                            <Play className="mr-2 w-4 md:w-5 h-4 md:h-5 group-hover:scale-110 transition-transform" />
                            Start Visualizing
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto border-2 border-orange-400/50 text-foreground hover:bg-orange-500/10 px-8 py-5 md:py-6 text-base md:text-lg backdrop-blur-sm"
                        >
                            <BookOpen className="mr-2 w-4 md:w-5 h-4 md:h-5" />
                            Explore Problems
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto px-2">
                        {stats.map((stat, index) => (
                            <Card
                                key={index}
                                className="bg-card/50 border-border backdrop-blur-md p-4 md:p-6 hover:bg-accent/50 transition-all duration-300 hover:scale-105"
                            >
                                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-primary mb-2 md:mb-3 mx-auto" />
                                <div className="text-2xl md:text-3xl font-bold text-foreground mb-0.5 md:mb-1">{stat.number}</div>
                                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Landing_hero