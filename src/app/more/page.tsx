'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/bottom-nav';
import { 
  ArrowLeft,
  Image as ImageIcon,
  Video,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useLoading } from '@/components/global-loader';

const menuItems = [
  { name: 'Photo Gallery', href: '/photo-gallery', icon: ImageIcon, bgColor: 'bg-indigo-100', textColor: 'text-indigo-600' },
  { name: 'Video Gallery', href: '/video-gallery', icon: Video, bgColor: 'bg-rose-100', textColor: 'text-rose-600' },
  { name: 'PDF Viewer', href: '/pdf-viewer', icon: FileText, bgColor: 'bg-teal-100', textColor: 'text-teal-600' },
];

export default function MorePage() {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    hideLoader();
  }, [hideLoader]);

  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">More Options</h1>
      </header>

      <main className="flex-1 p-4 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} key={item.name} className="flex" onClick={showLoader}>
              <Card className="w-full hover:bg-muted transition-colors shadow-md hover:shadow-lg rounded-2xl">
                <CardContent className="p-4 flex items-center justify-between text-center gap-3">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center ${item.bgColor} ${item.textColor} h-12 w-12 rounded-full`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-base">{item.name}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
}
