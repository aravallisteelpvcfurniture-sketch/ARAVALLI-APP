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
    name: 'Quotation',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="16" width="20" height="28" rx="2" fill="#93C5FD"/>
        <path d="M22 22H34" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 28H34" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 34H28" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
        <path d="M41 24C38.2386 24 36 26.2386 36 29C36 31.3134 37.5827 33.2062 39.7076 33.8113L41 44" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M41 32C41.8284 32 42.5 31.3284 42.5 30.5V30.5M41 35C40.1716 35 39.5 34.3284 39.5 33.5V33.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
        <path d="M39.5 29.5H42.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
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
        <path d="M32 16L32 20" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
        <path d="M42 22L39.1716 24.8284" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
        <path d="M48 32L44 32" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
        <path d="M42 42L39.1716 39.1716" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
        <path d="M22 22L24.8284 24.8284" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
        <path d="M16 32L20 32" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
        <path d="M22 42L24.8284 39.1716" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    href: 'inspiration',
  },
  {
    name: 'Site Measurement',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="18" width="36" height="28" rx="3" fill="#D1FAE5"/>
        <path d="M14 24H50" stroke="#6EE7B7" strokeWidth="2"/>
        <path d="M24 18V46" stroke="#6EE7B7" strokeWidth="2"/>
        <rect x="18" y="28" width="16" height="12" rx="2" fill="#A7F3D0"/>
        <path d="M20 31H32" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 35H28" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="38" y="21" width="8" height="4" rx="1.5" fill="#34D399"/>
      </svg>
    ),
    href: 'measurement',
  }
];

export default function VisitorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { visitorId } = params;

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Visitor</h1>
        </div>
        <div className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
        </div>
      </header>
      <main className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 p-4">
        {tools.map((tool) => (
          <Link href={`/visitors/${visitorId}/${tool.href}`} key={tool.name}>
            <Card className="h-full rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center gap-4 p-4 h-full">
                {tool.icon}
                <span className="text-sm font-semibold text-center text-card-foreground">{tool.name}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
        {tools.length % 2 !== 0 && <div className="hidden sm:block"></div>}
      </main>
    </div>
  );
}
