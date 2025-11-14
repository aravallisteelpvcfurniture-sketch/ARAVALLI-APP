'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTransition } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateTodaysFestivalPoster } from '@/lib/actions';
import html2canvas from 'html2canvas';

export default function GreetingsPage() {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isGenerating, startTransition] = useTransition();
  const { toast } = useToast();
  const posterRef = useRef<HTMLDivElement>(null);

  const handleGeneratePoster = () => {
    setPosterUrl(null); // Clear previous poster
    startTransition(async () => {
      try {
        const result = await generateTodaysFestivalPoster();
        if (result && result.imageUrl) {
          setPosterUrl(result.imageUrl);
          toast({
            title: 'Poster Generated!',
            description: 'Your daily poster is ready.',
          });
        } else {
          throw new Error('Failed to generate poster.');
        }
      } catch (error: any) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: error.message || 'Could not generate the poster.',
        });
      }
    });
  };

  const handleDownload = () => {
    if (posterRef.current) {
      html2canvas(posterRef.current, { useCORS: true }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'greeting-poster.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  // Automatically generate poster on component mount
  useEffect(() => {
    handleGeneratePoster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Daily Festival Greetings</h1>
            <p className="text-muted-foreground">
              Your daily auto-generated poster for today's occasion.
            </p>
          </div>

          <Card>
            <CardContent className="p-4">
              <div
                ref={posterRef}
                className="relative w-full aspect-video bg-muted rounded-lg flex items-center justify-center"
              >
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin" />
                    <p>Generating today's poster...</p>
                  </div>
                ) : posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt="Generated festival poster"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>Click the button to generate a poster.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={handleGeneratePoster} disabled={isGenerating}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate New Poster'}
            </Button>
            <Button onClick={handleDownload} disabled={!posterUrl || isGenerating} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
