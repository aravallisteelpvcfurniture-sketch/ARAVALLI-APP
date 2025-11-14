'use client';

import React, { useState, useTransition } from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Download, Loader2 } from 'lucide-react';
import { generateTodaysFestivalPoster } from '@/lib/actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface Poster {
  festivalName: string;
  imageUrl: string;
}

export default function GreetingsPage() {
  const [poster, setPoster] = useState<Poster | null>(null);
  const [isGenerating, startTransition] = useTransition();
  const { toast } = useToast();
  const posterRef = useRef<HTMLDivElement>(null);

  const handleGeneratePoster = () => {
    startTransition(async () => {
      setPoster(null);
      try {
        const result = await generateTodaysFestivalPoster();
        if (result) {
          setPoster(result);
          toast({
            title: 'Poster Generated!',
            description: `Your poster for ${result.festivalName} is ready.`,
          });
        } else {
          throw new Error();
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Could not generate the festival poster. Please try again.',
        });
      }
    });
  };

  const handleDownload = () => {
    if (!posterRef.current) return;

    html2canvas(posterRef.current, {
        allowTaint: true,
        useCORS: true,
    }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${poster?.festivalName?.toLowerCase().replace(' ', '-')}-poster.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
  };


  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-accent" />
              AI Festival Poster Generator
            </CardTitle>
            <CardDescription>
              Let AI detect the next upcoming festival and create a beautiful poster for you with one click!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!poster && !isGenerating && (
                 <div className="p-8 flex flex-col items-center justify-center gap-4">
                    <Button onClick={handleGeneratePoster} size="lg">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate Today's Festival Poster
                    </Button>
                </div>
            )}
            
            {isGenerating && (
              <div className="flex flex-col items-center justify-center p-8 gap-4 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin" />
                <p className="font-medium">Finding the next festival...</p>
                <p className="text-sm">Our AI is creating a unique poster for you. This might take a moment.</p>
              </div>
            )}

            {poster && (
                <div className="space-y-4">
                     <div ref={posterRef} className="relative w-full aspect-video overflow-hidden rounded-lg border">
                         <Image
                            src={poster.imageUrl}
                            alt={poster.festivalName}
                            fill
                            className="object-contain"
                         />
                     </div>
                     <h3 className="text-2xl font-bold">{poster.festivalName}</h3>
                     <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Poster
                        </Button>
                        <Button onClick={handleGeneratePoster} variant="secondary">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Again
                        </Button>
                     </div>
                </div>
            )}
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}
