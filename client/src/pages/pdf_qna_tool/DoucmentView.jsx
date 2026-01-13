import { askQuestion, getDocumentDetails } from '@/utils/pdf_qna_tool/pdf';
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Sparkles, Send, History, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

const DoucmentView = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState('');
    const [qaLoading, setQaLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await getDocumentDetails(id);
                setDocument(response.data);
                setLoading(false);
            } catch (error) {
                setError(`Could not load document details`);
                setLoading(false);
            }
        };
        fetchDocument();
    }, [id]);

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setQaLoading(true);
        setError(null);

        try {
            // BUG FIX: changed docId to id
            const response = await askQuestion(id, question.trim());
            setDocument(prev => ({ ...prev, qaHistory: response.data.history }));
            setQuestion('');
        } catch (error) {
            setError("Failed to get an answer. Please try again.");
        } finally {
            setQaLoading(false);
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Reading document analysis...</p>
        </div>
    );

    if (error && !document) return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6 text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                    <p className="text-destructive font-medium">{error}</p>
                    <Link to="/documents/history">
                        <Button variant="outline">Back to History</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );

    if (!document) return null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between gap-4">
                    <Link to="/documents/history">
                        <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/5 hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to History
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider font-medium">
                        <FileText className="w-4 h-4" />
                        Document Analysis
                    </div>
                </div>

                <header className="space-y-3">
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent break-words pb-1">
                        {document.filename}
                    </h1>
                    <p className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <span className="flex items-center gap-1.5 font-medium text-primary/80">
                            <FileText className="w-4 h-4" />
                            PDF ANALYSIS
                        </span>
                        <span className="flex items-center gap-1.5">
                            <History className="w-4 h-4" />
                            {new Date(document.createdAt).toLocaleDateString()} at {new Date(document.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Summary */}
                    <div className="lg:col-span-12">
                        <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm overflow-hidden shadow-xl shadow-primary/5">
                            <CardHeader className="border-b border-primary/10 bg-primary/5 p-4 md:p-6">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    <CardTitle className="text-lg md:text-xl">AI Summary</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6">
                                <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                                    {document.summary || "Summary generation is in progress..."}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Q&A Section */}
                    <div className="lg:col-span-12 space-y-6">
                        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                    <CardTitle className="text-xl">Ask Questions</CardTitle>
                                </div>
                                <CardDescription>
                                    Query specific details or ask for clarifications based on the document content.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <form onSubmit={handleQuestionSubmit} className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            placeholder="What would you like to know about this document?"
                                            className="w-full h-12 px-4 bg-background border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                                            disabled={qaLoading}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={!question.trim() || qaLoading}
                                        className="h-12 px-6 gap-2"
                                    >
                                        {qaLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>Ask</span>
                                            </>
                                        )}
                                    </Button>
                                </form>

                                {error && (
                                    <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4 pt-4 border-t border-border/40">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                                        <History className="w-4 h-4" />
                                        Conversation History
                                    </div>

                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-premium">
                                        {document.qaHistory && document.qaHistory.slice().reverse().map((qa, index) => (
                                            <div key={index} className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                                                <div className="flex justify-end">
                                                    <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none px-4 py-2 max-w-[85%] text-foreground">
                                                        <p className="text-xs font-bold text-primary mb-1">YOU</p>
                                                        {qa.question}
                                                    </div>
                                                </div>
                                                <div className="flex justify-start">
                                                    <div className="bg-muted/30 border border-border/40 rounded-2xl rounded-tl-none px-4 py-2 max-w-[85%] text-foreground/90">
                                                        <p className="text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3" />
                                                            DSA-DUDE AI
                                                        </p>
                                                        {qa.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!document.qaHistory || document.qaHistory.length === 0) && (
                                            <div className="text-center py-8 space-y-2">
                                                <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto" />
                                                <p className="text-muted-foreground italic">No questions asked yet. Start the conversation!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoucmentView;