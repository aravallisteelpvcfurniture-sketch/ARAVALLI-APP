your-project-folder/
├── public/           <-- यहाँ है public फ़ोल्डर
├── src/              <-- आपका सारा ऐप कोड यहाँ है
├── package.json      <-- प्रोजेक्ट की निर्भरता वाली फ़ाइल
├── next.config.ts    <-- Next.js कॉन्फ़िगरेशन फ़ाइल
└── ... (और भी फ़ाइलें और फ़ोल्डर)
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Draggable from 'react-draggable';
import { ImagePlaceholder } from '@/lib/placeholder-images';
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

    const [companyName, setCompanyName] = useState('Your Company');
    const [mobile, setMobile] = useState('+91 98765 43210');
    const [email, setEmail] = useState('contact@yourcompany.com');

    useEffect(() => {
        if (userProfile) {
            setCompanyName(userProfile.companyName || 'Your Company');
            setMobile(userProfile.mobile || '+91 98765 43210');
            setEmail(userProfile.email || user?.email || 'contact@yourcompany.com');
        } else if (user) {
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
        <div className="flex flex-col gap-4">
            <Card>
                <CardContent className="p-2">
                    {isProfileLoading ? (
                         <div className="relative w-full aspect-video overflow-hidden flex items-center justify-center">
                             <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                         </div>
                    ) : (
                        <div ref={editorRef} className="relative w-full aspect-video overflow-hidden">
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
            <Button onClick={handleDownload} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Image
            </Button>
        </div>
    );
}
