'use client';

import React, { useState, useTransition, useRef } from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Sparkles, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { generatePoster } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';

import placeholderData from '@/lib/placeholder-images.json';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';


interface GreetingEditorProps {
    image: { imageUrl: string; description: string };
    onDownload: (element: HTMLDivElement) => void;
}

function GreetingEditor({ image, onDownload }: GreetingEditorProps) {
    const { user } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user?.uid]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

    const [companyName, setCompanyName] = useState('Your Company');
    const [mobile, setMobile] = useState('+91 98765 43210');
    const [email, setEmail] = useState('contact@yourcompany.com');

    React.useEffect(() => {
        if (userProfile) {
            setCompanyName(userProfile.companyName || 'Your Company');
            setMobile(userProfile.mobile || '+91 98765 43210');
            setEmail(userProfile.email || user?.email || 'contact@yourcompany.com');
        } else if (user) {
            setEmail(user.email || 'contact@yourcompany.com');
        }
    }, [userProfile, user]);

    const editorRef = useRef<HTMLDivElement>(null);
    const companyNameRef = useRef<HTMLDivElement>(null);
    const mobileRef = useRef<HTMLDivElement>(null);
    const emailRef = useRef<HTMLDivElement>(null);
    
    const handleDownloadClick = () => {
        if (editorRef.current) {
            onDownload(editorRef.current);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardContent className="p-2">
                    {isProfileLoading ? (
                         <div className="relative w-full aspect-video overflow-hidden flex items-center justify-center">
                             <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                         </div>
                    ) : (
                        <div ref={editorRef} className="relative w-full aspect-square md:aspect-video overflow-hidden bg-white">
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                layout="fill"
                                objectFit="contain"
                                className="pointer-events-none"
                            />
                            <Draggable bounds="parent" nodeRef={companyNameRef}>
                                <div ref={companyNameRef} className="absolute cursor-move p-2 bg-black/30 rounded-md" style={{top: '5%', left: '5%'}}>
                                    <p className="text-white text-lg font-bold" style={{ textShadow: '1px 1px 2px black' }}>
                                        {companyName}
                                    </p>
                                </div>
                            </Draggable>
                            <Draggable bounds="parent" nodeRef={mobileRef}>
                                <div ref={mobileRef} className="absolute cursor-move p-2 bg-black/30 rounded-md" style={{bottom: '5%', left: '5%'}}>
                                    <p className="text-white text-sm" style={{ textShadow: '1px 1px 2px black' }}>
                                        {mobile}
                                    </p>
                                </div>
                            </Draggable>
                            <Draggable bounds="parent" nodeRef={emailRef}>
                                <div ref={emailRef} className="absolute cursor-move p-2 bg-black/30 rounded-md" style={{bottom: '5%', right: '5%'}}>
                                    <p className="text-white text-sm" style={{ textShadow: '1px 1px 2px black' }}>
                                        {email}
                                    </p>
                                </div>
                            </Draggable>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Button onClick={handleDownloadClick} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Image
            </Button>
        </div>
    );
}


export default function GreetingsPage() {
    const { images } = placeholderData;
    const [prompt, setPrompt] = useState('');
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isGenerating, startTransition] = useTransition();
    const { toast } = useToast();
    
    const [selectedImage, setSelectedImage] = useState<{imageUrl: string; description: string} | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const handleImageClick = (image: {imageUrl: string; description: string}) => {
        setSelectedImage(image);
        setIsEditorOpen(true);
    };

    const handleGeneratePoster = () => {
        if (!prompt) {
            toast({
                variant: 'destructive',
                title: 'Prompt is empty',
                description: 'Please enter a theme for your poster.',
            });
            return;
        }

        startTransition(async () => {
            setGeneratedImageUrl(null);
            try {
                const result = await generatePoster(prompt);
                setGeneratedImageUrl(result.imageUrl);
                 toast({
                    title: 'Poster Generated!',
                    description: 'Your AI poster is ready.',
                });
            } catch (error) {
                console.error(error);
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
                toast({
                    variant: 'destructive',
                    title: 'Generation Failed',
                    description: `Could not generate poster. Reason: ${errorMessage}`,
                });
            }
        });
    };

    const handleDownload = (element: HTMLDivElement) => {
        html2canvas(element, {
            allowTaint: true,
            useCORS: true,
            backgroundColor: '#ffffff',
            scale: 2,
        }).then((canvas) => {
            const link = document.createElement('a');
            link.download = `${selectedImage?.description.toLowerCase().replace(/\s+/g, '-') || 'greeting'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast({
                title: 'Download Started',
                description: 'Your customized greeting card is being downloaded.',
            });
            setIsEditorOpen(false);
        }).catch(err => {
            console.error("Error generating canvas: ", err);
            toast({
                variant: 'destructive',
                title: 'Download Failed',
                description: 'Could not create the image. Please try again.',
            });
        });
    };

    return (
        <div className="flex flex-col min-h-dvh bg-background text-foreground">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Festival Greetings</h1>
                    <p className="text-muted-foreground">Generate a unique poster with AI or browse our collection.</p>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-accent" />
                            AI Poster Generator
                        </CardTitle>
                        <CardDescription>
                           Enter a theme for your festival poster (e.g., "Happy Diwali with diyas and lights").
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input 
                                placeholder="Enter poster theme..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                disabled={isGenerating}
                            />
                            <Button onClick={handleGeneratePoster} disabled={isGenerating} className="w-full sm:w-auto">
                                {isGenerating ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="mr-2 h-4 w-4" />
                                )}
                                Generate
                            </Button>
                        </div>

                         {isGenerating && (
                            <div className="mt-6 flex flex-col items-center justify-center text-center text-muted-foreground h-64 border-2 border-dashed rounded-lg">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                <p className="font-semibold mt-4">Generating your poster...</p>
                                <p className="text-sm">This might take a moment.</p>
                            </div>
                        )}
                        
                        {generatedImageUrl && (
                           <div className="mt-6">
                             <h3 className="font-bold text-lg mb-2">Your Generated Poster:</h3>
                             <Card 
                                className="overflow-hidden group cursor-pointer transition-transform hover:scale-105"
                                onClick={() => handleImageClick({imageUrl: generatedImageUrl, description: prompt})}
                              >
                                <CardContent className="p-0 relative">
                                    <Image
                                        src={generatedImageUrl}
                                        alt={prompt}
                                        width={600}
                                        height={400}
                                        className="object-cover aspect-video w-full"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                        <p className="text-white font-semibold">{prompt}</p>
                                    </div>
                                </CardContent>
                            </Card>
                           </div>
                        )}
                    </CardContent>
                </Card>
                
                <div className="my-6 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <h3 className="font-bold text-lg mb-4 text-center sm:text-left">Browse Our Collection</h3>
                    {images && images.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {images.map((image) => (
                                <Card 
                                    key={image.id} 
                                    className="overflow-hidden group cursor-pointer transition-transform hover:scale-105"
                                    onClick={() => handleImageClick(image)}
                                >
                                    <CardContent className="p-0 relative">
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.description}
                                            width={600}
                                            height={400}
                                            className="object-cover aspect-video w-full"
                                            data-ai-hint={image.imageHint}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                            <p className="text-white font-semibold">{image.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64 border-2 border-dashed rounded-lg">
                            <p className="font-semibold">No Greeting Posters Found</p>
                            <p className="text-sm">The static image collection is empty.</p>
                        </div>
                    )}
                </div>
            </main>

            <BottomNav />

            {selectedImage && (
                <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                    <DialogContent className="max-w-4xl p-4 sm:p-6">
                        <DialogHeader>
                            <DialogTitle>Greeting Card Editor</DialogTitle>
                            <DialogDescription>
                                Drag your company details to the desired position. Click download when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <GreetingEditor image={selectedImage} onDownload={handleDownload} />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
