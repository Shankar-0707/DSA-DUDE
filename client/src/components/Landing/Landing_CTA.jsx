import { ArrowRight } from 'lucide-react'
import React from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'

const Landing_CTA = () => {
    return (
        <>
            <section className="relative z-10 container mx-auto px-6 py-8 mb-8">
                <Card className="max-w-4xl mx-auto bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 border-0 p-12 md:p-16 text-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            Ready to Master DSA?
                        </h2>
                        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                            Join for acing the coding interviews with DSA-DUDE
                        </p>
                        <Button
                            size="lg"
                            className="bg-white text-purple-600 hover:bg-slate-100 px-8 py-6 text-lg font-semibold shadow-2xl group"
                            onClick={() => navigate('/home')}
                        >
                            Start Learning Now
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </Card>
            </section>
        </>
    )
}

export default Landing_CTA