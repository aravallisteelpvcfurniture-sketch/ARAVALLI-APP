'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/bottom-nav';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { useLoading } from '@/components/global-loader';

const videos = [
  { id: '1', title: 'Modular Kitchen Showcase', thumbnailUrl: 'https://picsum.photos/seed/vid1/800/600', 'data-ai-hint': 'kitchen showcase' },
  { id: '2', title: 'Wardrobe Assembly Time-lapse', thumbnailUrl: 'https://picsum.photos/seed/vid2/800/600', 'data-ai-hint': 'wardrobe assembly' },
  { id: '3', title: 'Living Room Transformation', thumbnailUrl: 'https://picsum.photos/seed/vid3/800/600', 'data-ai-hint': 'living room' },
  { id: '4', title: 'Custom Furniture Crafting', thumbnailUrl: 'https://picsum.photos/seed/vid4/800/600', 'data-ai-hint': 'furniture crafting' },
];

export default function VideoGalleryPage() {
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
        <h1 className="text-xl font-bold">Video Gallery</h1>
      </header>

      <main className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden group rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-0 relative">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="object-cover w-full aspect-video transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={video['data-ai-hint']}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="h-16 w-16 text-white" />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white font-bold text-lg">{video.title}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}
