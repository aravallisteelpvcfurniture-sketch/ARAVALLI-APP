'use client';

import React, { useState, useRef } from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Sparkles, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Draggable from 'react-draggable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import placeholderData from '@/lib/placeholder-images.json';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface GreetingEditorProps {
    image: ImagePlaceholder;
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
    const [selectedImage, setSelectedImage] = useState<ImagePlaceholder | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const { toast } = useToast();

    const handleImageClick = (image: ImagePlaceholder) => {
        setSelectedImage(image);
        setIsEditorOpen(true);
    };

    const handleDownload = (element: HTMLDivElement) => {
        html2canvas(element, {
            allowTaint: true,
            useCORS: true,
            backgroundColor: '#ffffff',
            scale: 2, // Increase resolution
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
                    <p className="text-muted-foreground">Browse, customize, and download greetings for various festivals.</p>
                </div>
                
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
                        <p className="text-sm">It looks like the image configuration is empty.</p>
                    </div>
                )}
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
