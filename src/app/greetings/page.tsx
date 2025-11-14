'use client';

import React, { useState, useTransition, useRef } from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generatePoster } from '@/lib/actions';
import Image from 'next/image';
import { Download, Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

export default function GreetingsPage() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, startTransition] = useTransition();
  const { toast } = useToast();
  const imageRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!prompt) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please enter a prompt to generate a poster.',
      });
      return;
    }
    startTransition(async () => {
      const result = await generatePoster(prompt);
      if (result && result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        toast({
          title: 'Poster Generated!',
          description: 'Your AI-powered poster is ready.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: 'Could not generate poster. Please try again.',
        });
      }
    });
  };

  const handleDownload = () => {
    if (!imageRef.current) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not find the image to download.',
        });
        return;
    };

    html2canvas(imageRef.current, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: null, 
    }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'ai-poster.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        console.error("Error generating canvas: ", err);
        toast({
            variant: 'destructive',
            title: 'Download Failed',
            description: 'Could not download the image.',
        });
    });
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">AI Poster Generator</h1>
            <p className="text-muted-foreground">
              Describe the poster you want to create for any festival or occasion.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Input
                  type="text"
                  placeholder="e.g., A colorful poster for Holi with splashes of paint"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                />
                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full sm:w-auto">
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Poster</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-10 w-10 animate-spin" />
                    <p>Generating your masterpiece...</p>
                  </div>
                ) : generatedImage ? (
                  <div ref={imageRef} className="w-full h-full">
                    <Image
                      src={generatedImage}
                      alt={prompt}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>Your generated poster will appear here.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {generatedImage && !isGenerating && (
             <Button onClick={handleDownload} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Poster
            </Button>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
