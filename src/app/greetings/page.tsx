'use client';

import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent } from '@/components/ui/card';

const images = [
  {
    src: 'https://i.ibb.co/vxQWBCbr/10321192.jpg',
    alt: 'A beautiful greeting image',
    width: 612,
    height: 408,
  },
  {
    src: 'https://i.ibb.co/hKxSPYp/gettyimages-1201199341-612x612.jpg',
    alt: 'A festive greeting image',
    width: 612,
    height: 612,
  },
];

export default function GreetingsPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header title="Greetings" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Greetings Gallery</h1>
          <p className="text-muted-foreground">A collection of beautiful greetings.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <Card key={index} className="overflow-hidden group rounded-2xl">
              <CardContent className="p-0">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  quality={100}
                  className="object-contain w-full h-auto transition-transform duration-300 group-hover:scale-105"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
