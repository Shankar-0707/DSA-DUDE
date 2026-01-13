import { uploadDocument } from '@/utils/pdf_qna_tool/pdf';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setError(null);
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError(`Please select a PDF file to upload`);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await uploadDocument(file);
            navigate(`/document/${response.data.id}`);
        } catch (error) {
            console.error(error);
            setError("Upload failed. Please try again. (Is the server running?)");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <Card className="w-full max-w-xl border-border/40 bg-card/60 backdrop-blur-sm shadow-2xl">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                            <UploadCloud className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Analyze PDF Document
                        </CardTitle>
                        <CardDescription className="text-base">
                            Upload your PDF and let AI summarize and answer your questions.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="relative group">
                                <label
                                    className={`
                                    flex flex-col items-center justify-center w-full h-48 
                                    border-2 border-dashed rounded-xl cursor-pointer 
                                    transition-all duration-300
                                    ${file
                                            ? 'border-primary bg-primary/5'
                                            : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-accent/50'}
                                `}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {file ? (
                                            <>
                                                <FileText className="w-10 h-10 text-primary mb-3" />
                                                <p className="mb-2 text-sm text-foreground font-medium px-4 text-center break-all line-clamp-2">{file.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <UploadCloud className="w-10 h-10 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
                                                <p className="mb-2 text-sm text-foreground">
                                                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-muted-foreground">PDF file (max. 10MB)</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        disabled={loading}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                                disabled={!file || loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing Document...
                                    </>
                                ) : (
                                    'Upload & Summarize'
                                )}
                            </Button>
                        </form>

                        {error && (
                            <div className="flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-lg text-center animate-pulse">
                                <p className="text-sm font-medium text-primary">
                                    AI is reading your document...
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    This usually takes 10-20 seconds depending on the size.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Upload;