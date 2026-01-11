'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/bottom-nav';
import { ArrowLeft } from 'lucide-react';
import { useLoading } from '@/components/global-loader';

const catalogueImages = [
  {
    src: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2070&auto=format&fit=crop',
    alt: 'Modern modular kitchen',
    'data-ai-hint': 'modern kitchen',
  },
  {
    src: 'https://images.unsplash.com/photo-1618221014314-99804c1a35da?q=80&w=1932&auto=format&fit=crop',
    alt: 'Sleek wooden wardrobe',
    'data-ai-hint': 'wooden wardrobe',
  },
  {
    src: 'https://images.unsplash.com/photo-1593185382833-315878572457?q=80&w=2070&auto=format&fit=crop',
    alt: 'Minimalist TV unit',
    'data-ai-hint': 'minimalist tv_unit',
  },
  {
    src: 'https://images.unsplash.com/photo-1558991374-15b6b3531398?q=80&w=1974&auto=format&fit=crop',
    alt: 'Elegant dressing table',
    'data-ai-hint': 'elegant dressing_table',
  },
   {
    src: 'https://images.unsplash.com/photo-1600585152225-3579fe9d7ae2?q=80&w=2070&auto=format&fit=crop',
    alt: 'Spacious kitchen storage',
    'data-ai-hint': 'kitchen storage'
  },
  {
    src: 'https://images.unsplash.com/photo-1631679704024-52c8034a3370?q=80&w=1974&auto=format&fit=crop',
    alt: 'Decorative wall paneling',
    'data-ai-hint': 'wall paneling'
  },
];

export default function CataloguePage() {
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
        <h1 className="text-xl font-bold">Catalogue</h1>
      </header>

      <main className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {catalogueImages.map((image, index) => (
          <Card key={index} className="overflow-hidden group rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={600}
                className="object-cover w-full aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
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
