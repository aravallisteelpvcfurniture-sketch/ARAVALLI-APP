'use client';

import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Cog, FileText, Users, Hand, User, Bell } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const tools = [
  {
    name: 'Tools',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" fill="#f97316" stroke="white" />
        <circle cx="12" cy="12" r="3" fill="#fbbf24" stroke="white" />
      </svg>
    ),
    href: '#',
  },
  {
    name: 'Invoice Bill',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" fill="#3b82f6" stroke="white" />
            <polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="1.5" />
            <line x1="16" y1="13" x2="8" y2="13" stroke="white" strokeWidth="1.5" />
            <line x1="16" y1="17" x2="8" y2="17" stroke="white" strokeWidth="1.5" />
            <line x1="10" y1="9" x2="8" y2="9" stroke="white" strokeWidth="1.5" />
        </svg>
    ),
    href: '#',
  },
  {
    name: 'Greetings',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 19h-1.4c-1 0-1.8.8-1.8 1.8 0 .1.1.2.2.2h5.6c.1 0 .2-.1.2-.2 0-1-.8-1.8-1.8-1.8H18Z" fill="#ec4899" stroke="white" />
            <path d="M12 12v3" stroke="#ec4899" />
            <path d="M12 3a7.4 7.4 0 0 1 7.4 7.4c0 1.2-.3 2.3-1 3.2l-6.4 7.4-6.4-7.4A7.4 7.4 0 0 1 12 3Z" fill="#f9a8d4" stroke="white" />
        </svg>
    ),
    href: '/greetings',
  },
  {
    name: 'Profile',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" fill="#22c55e" stroke="white" />
            <path d="M12 12c-4.4 0-8 2.7-8 6v2h16v-2c0-3.3-3.6-6-8-6Z" fill="#86efac" stroke="white" />
        </svg>
    ),
    href: '/profile',
  },
  {
    name: 'Visitors',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill="#a78bfa" stroke="white"/>
            <circle cx="9" cy="7" r="4" fill="#c4b5fd" stroke="white"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="#a78bfa" stroke-width="2.5" fill="none"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#c4b5fd" stroke-width="2.5" fill="none"/>
        </svg>
    ),
    href: '#',
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
