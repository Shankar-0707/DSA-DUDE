import Landing_navigation from '@/components/Landing/Landing_navigation';
import Landing_hero from '@/components/Landing/Landing_hero';
import Landing_howworks from '@/components/Landing/Landing_howworks';
import Landing_Features from '@/components/Landing/Landing_Features';
import Landing_CTA from '@/components/Landing/Landing_CTA';
import Landing_footer from '@/components/Landing/Landing_footer';
import { Boxes } from '@/components/ui/background-boxes';

const Landing = () => {

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
            {/* Animated Background Elements - Subtle Gradient layer */}
            <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-100">
                <Boxes />
            </div>

            {/* Navigation */}
            <Landing_navigation />

            {/* Hero Section */}
            <Landing_hero />


            {/* How It Works */}
            <Landing_howworks />


            {/* Features Grid */}
            <Landing_Features />

            {/* CTA Section */}
            <Landing_CTA />

            {/* Footer */}
            <Landing_footer />
        </div>
    );
};

export default Landing;