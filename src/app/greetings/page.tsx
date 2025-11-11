'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages, ImagePlaceholder } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Download, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { GreetingEditor } from '@/components/greeting-editor';


export default function GreetingsPage() {
  const greetingImages = PlaceHolderImages.filter(img => img.imageHint.includes('festival')).slice(0, 9);
  const [selectedImage, setSelectedImage] = useState<ImagePlaceholder | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleEdit = (image: ImagePlaceholder) => {
    setSelectedImage(image);
    setIsEditorOpen(true);
  };
  
  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `greeting-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Festival Greetings</h1>
          <p className="text-muted-foreground">Browse, customize, and download greetings for various festivals.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {greetingImages.map((image) => (
            <Card key={image.id} className="overflow-hidden group">
              <CardContent className="p-0 relative">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  width={600}
                  height={400}
                  className="object-cover aspect-video w-full transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={image.imageHint}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleEdit(image)}
                    title="Edit"
                   >
                     <Edit className="h-5 w-5" />
                     <span className="sr-only">Edit</span>
                   </Button>
                   <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleDownload(image.imageUrl)}
                    title="Download original"
                   >
                     <Download className="h-5 w-5" />
                     <span className="sr-only">Download</span>
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <BottomNav />
      {selectedImage && (
         <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Customize Greeting</DialogTitle>
                <DialogDescription>
                  Add your details and drag them to position. Then click download.
                </DialogDescription>
              </DialogHeader>
              <GreetingEditor image={selectedImage} />
            </DialogContent>
         </Dialog>
      )}
    </div>
  );
}
