import { Code2, X } from 'lucide-react'
import React, { useState } from 'react'

const Landing_footer = () => {
    const [activePopup, setActivePopup] = useState(null);

    const popupContent = {
        privacy: {
            title: "Privacy Policy",
            content: "Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our platform. We are committed to ensuring that your data remains secure and confidential."
        },
        terms: {
            title: "Terms of Service",
            content: "By accessing and using DSA-DUDE, you agree to comply with our Terms of Service. These terms govern your use of the platform, including user conduct, intellectual property rights, and liability limitations."
        },
        support: {
            title: "Support",
            content: "Need help? Our support team is here for you. Contact us at support@dsa-dude.com for assistance with account issues, technical problems, or any other inquiries. We aim to respond within 24 hours."
        }
    };

    const handleOpenPopup = (e, type) => {
        e.preventDefault();
        setActivePopup(type);
    };

    const handleClosePopup = () => {
        setActivePopup(null);
    };

    return (
        <>
            <footer className="relative z-10 border-t border-border backdrop-blur-sm">
                <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <Code2 className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                                DSA-DUDE
                            </span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
                            <p className="text-muted-foreground text-xs md:text-sm order-2 md:order-1">
                                © 2026 DSA-DUDE.
                            </p>
                            <div className="flex items-center gap-6 text-xs md:text-sm text-muted-foreground order-1 md:order-2">
                                <button onClick={(e) => handleOpenPopup(e, 'privacy')} className="hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Privacy</button>
                                <button onClick={(e) => handleOpenPopup(e, 'terms')} className="hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Terms</button>
                                <button onClick={(e) => handleOpenPopup(e, 'support')} className="hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Support</button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Popup Modal */}
            {activePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-background border border-border rounded-xl shadow-lg max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={handleClosePopup}
                            className="absolute right-4 top-4 p-1 rounded-full hover:bg-muted transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-bold mb-4 pr-8">{popupContent[activePopup].title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {popupContent[activePopup].content}
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Landing_footer