import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "What is DSA-DUDE?",
        answer: "DSA-DUDE is an interactive platform designed to help students and developers master Data Structures and Algorithms. We provide a curated path from basics to advanced topics."
    },
    {
        question: "Is it free to use?",
        answer: "Yes, DSA-DUDE is completely free to use. Our goal is to make high-quality DSA education accessible to everyone."
    },
    {
        question: "Do I need an account to practice?",
        answer: "While you can view the roadmap without an account, we recommend signing up to track your progress, save your favorite problems, and join the community."
    },
    {
        question: "What technologies are used in DSA-DUDE?",
        answer: "Our platform is built using the MERN stack (MongoDB, Express, React, Node.js) with Tailwind CSS for styling and Framer Motion for premium animations."
    },
    {
        question: "Can I contribute to the platform?",
        answer: "Absolutely! We are an open-source project. You can find our repository on GitHub and contribute by adding new features, solving bugs, or improving documentation."
    }
];

const FAQItem = ({ question, answer, isOpen, toggleOpen }) => {
    return (
        <div className="border-b border-orange-500/10 last:border-0">
            <button
                className="w-full py-6 flex items-center justify-between text-left group transition-all"
                onClick={toggleOpen}
            >
                <span className={`text-lg md:text-xl font-semibold transition-colors duration-300 ${isOpen ? 'text-orange-500' : 'text-foreground/80 group-hover:text-foreground'}`}>
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`shrink-0 ml-4 ${isOpen ? 'text-orange-500' : 'text-muted-foreground'}`}
                >
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Landing_FAQs = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section id="faqs" className="py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold mb-4 tracking-tight"
                    >
                        Frequently Asked <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Questions</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Everything you need to know about the platform and how to get started on your DSA journey.
                    </motion.p>
                </div>

                <div className="max-w-4xl mx-auto bg-card/30 backdrop-blur-sm border border-orange-500/10 rounded-2xl p-4 md:p-8 shadow-2xl shadow-orange-500/5">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            toggleOpen={() => setOpenIndex(openIndex === index ? -1 : index)}
                        />
                    ))}
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />
        </section>
    );
};

export default Landing_FAQs;
