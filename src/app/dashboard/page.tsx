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
    icon: Cog,
    href: '#',
  },
  {
    name: 'Invoice Bill',
    icon: FileText,
    href: '#',
  },
  {
    name: 'Greetings',
    icon: Hand,
    href: '/greetings',
  },
    {
    name: 'Profile',
    icon: User,
    href: '/profile',
  },
  {
    name: 'Visitors',
    icon: Users,
    href: '#',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-primary">
        <header className="flex items-center p-4 sm:p-6 lg:px-8 pt-8">
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
                  <tool.icon className="h-6 w-6 text-primary" />
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
