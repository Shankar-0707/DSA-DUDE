import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                        Welcome to <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">DSA-DUDE</span>
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Your companion for mastering Data Structures and Algorithms. Start your journey today.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Home;
