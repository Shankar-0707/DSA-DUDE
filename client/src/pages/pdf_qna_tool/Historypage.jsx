import { getDocumentHistory } from '@/utils/pdf_qna_tool/pdf';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, ChevronRight, History, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Historypage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await getDocumentHistory();
                setDocuments(response.data);
            } catch (error) {
                setError(`Failed to load document history.`);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Retrieving your documents...</p>
        </div>
    );

    if (error) return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6 text-center space-y-4">
                    <p className="text-destructive font-medium">{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <History className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Document History</h2>
                        <p className="text-muted-foreground">Access your previously analyzed PDF documents.</p>
                    </div>
                </div>

                {documents.length === 0 ? (
                    <Card className="border-dashed bg-transparent">
                        <CardContent className="py-12 text-center space-y-4">
                            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                            <div className="space-y-1">
                                <p className="text-xl font-medium text-foreground/70">No documents yet</p>
                                <p className="text-muted-foreground">Upload your first PDF to see it here.</p>
                            </div>
                            <Link to="/documents">
                                <Button className="mt-4">
                                    Upload Now
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {documents.map((doc) => (
                            <Card key={doc._id} className="group hover:border-primary/50 transition-all duration-300 bg-card/40 backdrop-blur-sm overflow-hidden">
                                <Link to={`/document/${doc._id}`} className="block">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                                                    <FileText className="w-6 h-6 text-primary/70 group-hover:text-primary transition-colors" />
                                                </div>
                                                <div className="space-y-1 min-w-0">
                                                    <h3 className="text-xl font-semibold truncate group-hover:text-primary transition-colors">
                                                        {doc.filename}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {new Date(doc.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed italic">
                                                        {doc.summary || 'Summary pending...'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-primary font-medium text-sm md:opacity-0 md:group-hover:opacity-100 transition-all md:translate-x-2 md:group-hover:translate-x-0">
                                                <span className="md:inline">Open Results</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Historypage;