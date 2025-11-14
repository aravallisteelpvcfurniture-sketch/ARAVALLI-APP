'use client';

import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent } from '@/components/ui/card';

export default function GreetingsPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Greetings</h1>
            <p className="text-muted-foreground">
              Here are your uploaded greeting images.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="overflow-hidden group">
                <CardContent className="p-0 relative aspect-video">
                    <Image
                        src="/greeting-1.jpg"
                        alt="Greeting Image 1"
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                    />
                </CardContent>
            </Card>
            <Card className="overflow-hidden group">
                <CardContent className="p-0 relative aspect-video">
                    <Image
                        src="/greeting-2.jpg"
                        alt="Greeting Image 2"
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                    />
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
