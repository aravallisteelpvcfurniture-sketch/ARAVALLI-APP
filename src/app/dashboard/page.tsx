'use client';

import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, FileText, Users, Hand, User } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    name: 'Tools',
    icon: Wrench,
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
      <Header title="Welcome" />
      <main className="flex-1 flex flex-col bg-background text-foreground rounded-t-[2.5rem] shadow-lg">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link href={tool.href} key={tool.name}>
                <Card className="bg-card hover:bg-muted transition-colors h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
                    <tool.icon className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium text-center text-card-foreground">{tool.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
