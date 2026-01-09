import Landing_navigation from '@/components/Landing/Landing_navigation';
import Landing_hero from '@/components/Landing/Landing_hero';
import Landing_howworks from '@/components/Landing/Landing_howworks';
import Landing_Features from '@/components/Landing/Landing_Features';
import Landing_CTA from '@/components/Landing/Landing_CTA';
import Landing_footer from '@/components/Landing/Landing_footer';
import { Boxes } from '@/components/ui/background-boxes';

const Landing = () => {

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
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