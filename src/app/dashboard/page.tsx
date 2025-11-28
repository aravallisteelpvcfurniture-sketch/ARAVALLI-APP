'use client';

import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const tools = [
  {
    name: 'Tools',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="4" ry="4" fill="#fbbf24" />
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8zm0-14a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0V7a1 1 0 0 0-1-1zm0 4a3 3 0 1 0 3 3a3 3 0 0 0-3-3zm0 4a1 1 0 1 1 1-1a1 1 0 0 1-1 1z" fill="white"/>
      </svg>
    ),
    href: '#',
  },
  {
    name: 'Invoice Bill',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="4" ry="4" fill="#3b82f6" />
          <path d="M14.5 2.5a.5.5 0 0 0-.5-.5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2.5zM14 8h5.5L14 2.5V8z" fill="white" />
          <path d="M16 13H8v-1h8v1zm0 4H8v-1h8v1zm-6-8H8V8h2v1z" fill="#3b82f6" />
        </svg>
    ),
    href: '#',
  },
  {
    name: 'Greetings',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="4" ry="4" fill="#ec4899" />
          <path d="M4 10h16v2H4z" fill="#f9a8d4" />
          <path d="M12 4v16M4 12h16" stroke="white" strokeWidth="2" />
          <path d="M20 10v10H4V10c0-3 2-5 5-5h6c3 0 5 2 5 5z" fill="white" />
          <path d="M10 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" fill="#ec4899" />
        </svg>
    ),
    href: '/greetings',
  },
  {
    name: 'Profile',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <rect width="20" height="20" x="2" y="2" rx="4" ry="4" fill="#22c55e" />
            <circle cx="12" cy="9" r="3" fill="white" />
            <path d="M17 18c0-2.8-2.2-5-5-5s-5 2.2-5 5h10z" fill="white" />
        </svg>
    ),
    href: '/profile',
  },
  {
    name: 'Visitors',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="4" ry="4" fill="#a78bfa" />
          <path d="M16 17c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4v1h12v-1z" fill="white" />
          <circle cx="12" cy="9" r="2.5" fill="white" />
          <path d="M20.5 17c0-1.5-1-2.8-2.4-3.2.3-.4.5-.9.5-1.5 0-1.8-1.5-3.3-3.3-3.3s-3.3 1.5-3.3 3.3c0 .6.2 1.1.5 1.5-1.4.4-2.4 1.7-2.4 3.2v1h9.9l.1-1z" fill="#c4b5fd" opacity="0.8"/>
        </svg>
    ),
    href: '/visitors',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-primary">
        <header className="flex items-center p-4 sm:p-6 lg:px-8">
            <span className="text-xl font-semibold text-primary-foreground">Welcome</span>
            <div className="ml-auto flex gap-4 sm:gap-6">
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground">
                  <Bell className="h-6 w-6" />
                </Button>
            </div>
        </header>
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 bg-card text-foreground rounded-t-[2.5rem] shadow-xl">
        <Card className="mb-8 overflow-hidden rounded-2xl">
          <Image
            src="https://picsum.photos/seed/dashboard-banner/800/400"
            alt="Dashboard Banner"
            width={800}
            height={400}
            className="w-full h-auto object-cover"
            data-ai-hint="office workspace"
          />
        </Card>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link href={tool.href} key={tool.name}>
              <Card className="bg-card hover:bg-muted transition-colors h-full rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center p-4 gap-2 aspect-square">
                  <tool.icon className="h-8 w-8" />
                  <span className="text-xs font-medium text-center text-card-foreground">{tool.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
