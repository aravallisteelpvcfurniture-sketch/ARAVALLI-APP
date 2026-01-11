'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/bottom-nav';
import { ArrowLeft } from 'lucide-react';
import { useLoading } from '@/components/global-loader';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1588854337236-6889d631f379?q=80&w=2070&auto=format&fit=crop', alt: 'Living room interior', 'data-ai-hint': 'living room' },
  { src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop', alt: 'Modern sofa', 'data-ai-hint': 'modern sofa' },
  { src: 'https://images.unsplash.com/photo-1540574163024-5884424af2ac?q=80&w=1974&auto=format&fit=crop', alt: 'Wooden dining table', 'data-ai-hint': 'dining table' },
  { src: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1964&auto=format&fit=crop', alt: 'Comfortable armchair', 'data-ai-hint': 'armchair' },
  { src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop', alt: 'Cozy bedroom setup', 'data-ai-hint': 'cozy bedroom' },
  { src: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1974&auto=format&fit=crop', alt: 'Minimalist workspace', 'data-ai-hint': 'minimalist workspace' },
];

export default function PhotoGalleryPage() {
  const router = useRouter();
  const { hideLoader } = useLoading();

  useEffect(() => {
    hideLoader();
  }, [hideLoader]);

  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Photo Gallery</h1>
      </header>

      <main className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {galleryImages.map((image, index) => (
          <Card key={index} className="overflow-hidden group rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={600}
                className="object-cover w-full aspect-square transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={image['data-ai-hint']}
              />
            </CardContent>
          </Card>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}
