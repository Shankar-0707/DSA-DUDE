import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../ui/card'
import { Button } from '../ui/button'

const Landing_CTA = () => {
    const navigate = useNavigate();
    return (
        <>
            <section className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-12 mb-8">
                <Card className="max-w-4xl mx-auto bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 border-0 p-8 md:p-16 text-center overflow-hidden relative shadow-2xl shadow-orange-500/20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                            Ready to Master DSA?
                        </h2>
                        <p className="text-lg md:text-xl text-orange-50 mb-8 max-w-2xl mx-auto opacity-90 px-4">
                            Join for acing the coding interviews with DSA-DUDE
                        </p>
                        <Button
                            size="lg"
                            className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-5 md:py-6 text-base md:text-lg font-semibold shadow-2xl group border-0 w-full sm:w-auto"
                            onClick={() => navigate('/home')}
                        >
                            Start Learning Now
                            <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </Card>
            </section>
        </>
    )
}

export default Landing_CTA