'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Bell } from 'lucide-react';

const tools = [
  {
    name: 'Detail',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="13" y="16" width="38" height="24" rx="3" fill="#E0E7FF"/>
        <rect x="16" y="28" width="32" height="12" rx="1" fill="#C7D2FE"/>
        <circle cx="21" cy="22" r="1.5" fill="#A5B4FC"/>
        <circle cx="26" cy="22" r="1.5" fill="#A5B4FC"/>
        <circle cx="31" cy="22" r="1.5" fill="#A5B4FC"/>
        <path d="M24 36C26.2091 36 28 34.2091 28 32C28 29.7909 26.2091 28 24 28C21.7909 28 20 29.7909 20 32C20 34.2091 21.7909 36 24 36Z" fill="#A5B4FC"/>
        <path d="M33 30H38V32H33V30Z" fill="#A5B4FC"/>
        <path d="M33 34H38V36H33V34Z" fill="#A5B4FC"/>
      </svg>
    ),
    href: 'detail',
  },
  {
    name: 'Site Measurement',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M48 30C48 22.268 41.732 16 34 16H22C20.3431 16 19 17.3431 19 19V30H48Z" fill="#FCD34D"/>
        <path d="M19 30V32C19 35.3137 21.6863 38 25 38H34C41.732 38 48 31.732 48 24H45C45 29.5228 40.0228 34 34 34H25C23.8954 34 23 33.1046 23 32V30H19Z" fill="#FBBF24"/>
        <rect x="44" y="24" width="4" height="6" rx="1" fill="#374151"/>
      </svg>
    ),
    href: 'measurement',
  },
  {
    name: 'Quotation',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="16" width="20" height="28" rx="2" fill="#93C5FD"/>
        <path d="M22 22H34" stroke="#1D4ED8" stroke-width="2" stroke-linecap="round"/>
        <path d="M22 28H34" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
        <path d="M22 34H28" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
        <path d="M36 29C36 26.2386 38.2386 24 41 24C43.7614 24 46 26.2386 46 29C46 31.3134 44.4173 33.2062 42.2924 33.8113L41 44" fill="#FBBF24" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M41 32C41.8284 32 42.5 31.3284 42.5 30.5V30.5M41 35C40.1716 35 39.5 34.3284 39.5 33.5V33.5" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
        <path d="M39.5 29.5H42.5" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
      </svg>
    ),
    href: 'quotation',
  },
  {
    name: 'Inspiration',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 23C36.9706 23 41 27.0294 41 32C41 35.5373 38.9207 38.5332 36 39.9324V43H28V39.9324C25.0793 38.5332 23 35.5373 23 32C23 27.0294 27.0294 23 32 23Z" fill="#FCD34D"/>
        <rect x="29" y="43" width="6" height="3" rx="1" fill="#FBBF24"/>
        <path d="M32 16L32 20" stroke="#FCD34D" stroke-width="3" stroke-linecap="round"/>
        <path d="M42 22L39.1716 24.8284" stroke="#FCD34D" stroke-width="3" stroke-linecap="round"/>
        <path d="M48 32L44 32" stroke="#FCD34D" stroke-width="3" stroke-linecap="round"/>
        <path d="M42 42L39.1716 39.1716" stroke="#FCD34D" stroke-width="3" stroke-linecap="round"/>
        <path d="M22 22L24.8284 24.8284" stroke="#FCD34D" stroke-width="3" stroke-linecap="round"/>
        <path d="M16 32L20 32" stroke="#FCD34D" stroke-width="3" stroke-linecap="round"/>
        <path d="M22 42L24.8284 39.1716" stroke="#FCD34D" stroke-width="3" stroke-linecap="round"/>
        <path d="M30 19L31 17" stroke="#FCD34D" stroke-width="2" stroke-linecap="round"/>
        <path d="M34 19L33 17" stroke="#FCD34D" stroke-width="2" stroke-linecap="round"/>
      </svg>
    ),
    href: 'inspiration',
  },
];

export default function VisitorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { visitorId } = params;

  return (
    <div className="flex flex-col min-h-dvh bg-muted">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-green-500 text-white p-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Visitor</h1>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <Bell className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          {tools.map((tool) => (
            <Link key={tool.name} href={`/visitors/${visitorId}/${tool.href}`}>
              <Card className="aspect-square rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col items-center justify-center h-full p-4 gap-4">
                  <div className="w-16 h-16">{tool.icon}</div>
                  <p className="font-semibold text-center text-card-foreground">{tool.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
