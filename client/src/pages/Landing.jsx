import Landing_navigation from '@/components/Landing/Landing_navigation';
import Landing_hero from '@/components/Landing/Landing_hero';
import Landing_howworks from '@/components/Landing/Landing_howworks';
import Landing_Features from '@/components/Landing/Landing_Features';
import Landing_FAQs from '@/components/Landing/Landing_FAQs';
import Landing_CTA from '@/components/Landing/Landing_CTA';
import Landing_footer from '@/components/Landing/Landing_footer';

import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';

const Landing = () => {

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
            {/* Animated Background Elements - Subtle Gradient layer */}
            <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-100">
                <BackgroundRippleEffect />
            </div>

            {/* Navigation */}
            <Landing_navigation />

            {/* Hero Section */}
            <Landing_hero />


           

            {/* Features & How it works (Moved from Home Dash) */}
            <div className="bg-muted/30 border-y border-border/40 py-10">
                <Landing_howworks />
                <Landing_Features />
            </div>

             {/* FAQ Section */}
            <Landing_FAQs />

            {/* CTA Section */}
            <Landing_CTA />

            {/* Footer */}
            <Landing_footer />
        </div>
    );
};

export default Landing;