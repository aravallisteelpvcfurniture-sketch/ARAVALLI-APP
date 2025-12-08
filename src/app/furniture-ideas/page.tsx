'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/bottom-nav';
import { 
  ArrowLeft,
  CookingPot,
  Tv,
  Shirt,
  Sparkle,
  Archive,
  LayoutPanelLeft,
  ArrowUp,
  Spline,
  Container,
  Wrench,
} from 'lucide-react';

const furnitureCategories = [
  { name: 'Modular Kitchen', href: '#', icon: CookingPot, bgColor: 'bg-red-100', textColor: 'text-red-600' },
  { name: 'TV Unit', href: '#', icon: Tv, bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
  { name: 'Wardrobe', href: '#', icon: Shirt, bgColor: 'bg-green-100', textColor: 'text-green-600' },
  { name: 'Dressing Table', href: '#', icon: Sparkle, bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
  { name: 'Storage Units', href: '#', icon: Archive, bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
  { name: 'Kitchen Storage', href: '#', icon: Container, bgColor: 'bg-indigo-100', textColor: 'text-indigo-600' },
  { name: 'Wall Paneling', href: '#', icon: LayoutPanelLeft, bgColor: 'bg-pink-100', textColor: 'text-pink-600' },
  { name: 'Ceiling', href: '#', icon: ArrowUp, bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
  { name: 'Partitions', href: '#', icon: Spline, bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
  { name: 'Custom Furniture', href: '#', icon: Wrench, bgColor: 'bg-teal-100', textColor: 'text-teal-600' },
];

export default function FurnitureIdeasPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Furniture Ideas</h1>
      </header>

      <main className="flex-1 p-4 grid grid-cols-2 gap-4">
        {furnitureCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link href={category.href} key={category.name} className="flex">
              <Card className="w-full h-full hover:bg-muted transition-colors shadow-md hover:shadow-lg rounded-2xl">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3 h-full">
                  <div className={`flex items-center justify-center ${category.bgColor} ${category.textColor} h-16 w-16 rounded-full mb-2`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <p className="font-semibold text-base">{category.name}</p>
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
