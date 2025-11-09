'use client';

import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, FileText, Users, Hand } from 'lucide-react';
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
    href: '#',
  },
  {
    name: 'Visitors',
    icon: Users,
    href: '#',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link href={tool.href} key={tool.name}>
              <Card className="hover:bg-muted transition-colors h-full">
                <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
                  <tool.icon className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-center">{tool.name}</span>
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
