'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Draggable from 'react-draggable';
import { ImagePlaceholder } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

interface GreetingEditorProps {
    image: ImagePlaceholder;
}

export function GreetingEditor({ image }: GreetingEditorProps) {
    const { user } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user?.uid]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

    const [companyName, setCompanyName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (userProfile) {
            setCompanyName(userProfile.companyName || 'Your Company');
            setMobile(userProfile.mobile || '+91 98765 43210');
            setEmail(userProfile.email || user?.email || 'contact@yourcompany.com');
        } else if (user) {
            setCompanyName('Your Company');
            setMobile('+91 98765 43210');
            setEmail(user.email || 'contact@yourcompany.com');
        }
    }, [userProfile, user]);


    const editorRef = useRef(null);
    const companyNameRef = useRef(null);
    const mobileRef = useRef(null);
    const emailRef = useRef(null);

    // This is a placeholder for the download functionality.
    // True canvas-based image generation would require a library like html2canvas.
    const handleDownload = () => {
        alert("Download functionality for the customized image is not implemented yet. This would require a client-side library like html2canvas to generate the final image.");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardContent className="p-2">
                        <div ref={editorRef} className="relative w-full aspect-video overflow-hidden">
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                layout="fill"
                                objectFit="contain"
                                className="pointer-events-none"
                            />
                            <Draggable bounds="parent" nodeRef={companyNameRef}>
                                <div ref={companyNameRef} className="absolute cursor-move p-2 bg-black/30 rounded-md">
                                    <p className="text-white text-lg font-bold" style={{ textShadow: '1px 1px 2px black' }}>
                                        {companyName}
                                    </p>
                                </div>
                            </Draggable>
                            <Draggable bounds="parent" nodeRef={mobileRef}>
                                <div ref={mobileRef} className="absolute cursor-move p-2 bg-black/30 rounded-md" style={{top: '80%', left: '5%'}}>
                                    <p className="text-white text-sm" style={{ textShadow: '1px 1px 2px black' }}>
                                        {mobile}
                                    </p>
                                </div>
                            </Draggable>
                            <Draggable bounds="parent" nodeRef={emailRef}>
                                <div ref={emailRef} className="absolute cursor-move p-2 bg-black/30 rounded-md" style={{top: '80%', right: '5%'}}>
                                    <p className="text-white text-sm" style={{ textShadow: '1px 1px 2px black' }}>
                                        {email}
                                    </p>
                                </div>
                            </Draggable>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-4">
                { isProfileLoading ? (
                    <div className="space-y-4 flex flex-col items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">Loading Profile...</p>
                    </div>
                ) : (
                    <>
                        <div>
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <Button onClick={handleDownload} className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Download Customized Image
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
