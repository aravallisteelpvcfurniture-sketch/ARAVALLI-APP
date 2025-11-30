'use client';

import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, User, Briefcase, Handshake, Users, ClipboardList, PenTool, Award, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const primaryTools = [
  {
    name: 'Estimate',
    icon: Briefcase,
    href: '#',
    color: 'bg-red-500',
  },
  {
    name: 'Greetings',
    icon: Handshake,
    href: '/greetings',
    color: 'bg-blue-500',
  },
  {
    name: 'Visitors',
    icon: Users,
    href: '/visitors',
    color: 'bg-yellow-500',
  },
   {
    name: 'My Carpenter',
    icon: User,
    href: '#',
    color: 'bg-pink-500',
    badge: 'New',
  },
  {
    name: 'Confirm Order List',
    icon: ClipboardList,
    href: '#',
    color: 'bg-purple-600',
  },
];

const secondaryTools = [
    {
        name: 'Real Editor',
        icon: PenTool,
        href: '#'
    },
    {
        name: 'Carpenter Bonanza',
        icon: Award,
        href: '#'
    },
    {
        name: 'Catalogue',
        icon: BookOpen,
        href: '#'
    }
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
        <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
            <h1 className="text-2xl font-bold">Welcome!</h1>
            <div className="flex items-center gap-4">
                <Button variant='secondary' className='bg-primary-foreground text-primary hover:bg-primary-foreground/90'>Check In</Button>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground">
                  <Bell className="h-6 w-6" />
                </Button>
            </div>
        </header>
      <main className="flex-1 flex flex-col p-4 bg-background rounded-t-none">
        <div className="flex-grow space-y-6">
            <Card className="overflow-hidden rounded-2xl shadow-lg">
                <Image
                    src="https://i.ibb.co/3kCj7gC/carpenter-bonanza-offer.png"
                    alt="Carpenter Bonanza Offer"
                    width={800}
                    height={400}
                    className="w-full h-auto object-cover"
                    data-ai-hint="advertisement banner"
                />
            </Card>

            <div className="grid grid-cols-3 gap-4">
                {primaryTools.slice(0,3).map((tool) => (
                    <Link href={tool.href} key={tool.name}>
                        <Card className={`${tool.color} text-white rounded-2xl shadow-md hover:opacity-90 transition-opacity`}>
                            <CardContent className="flex flex-col items-center justify-center p-4 gap-2 aspect-square">
                            <tool.icon className="h-8 w-8" />
                            <span className="text-sm font-medium text-center">{tool.name}</span>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {primaryTools.slice(3).map((tool) => (
                    <Link href={tool.href} key={tool.name} className='relative'>
                        {tool.badge && <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full z-10">{tool.badge}</div>}
                        <Card className={`${tool.color} text-white rounded-2xl shadow-md hover:opacity-90 transition-opacity`}>
                            <CardContent className="flex flex-col items-center justify-center p-4 gap-2 aspect-video">
                                <tool.icon className="h-8 w-8" />
                                <span className="text-base font-semibold text-center mt-2">{tool.name}</span>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
                {secondaryTools.map((tool) => (
                    <Link href={tool.href} key={tool.name}>
                    <Card className="bg-card hover:bg-muted transition-colors h-full rounded-2xl shadow">
                        <CardContent className="flex flex-col items-center justify-center p-4 gap-2 aspect-square">
                            <tool.icon className="h-8 w-8 text-red-500" />
                            <span className="text-xs font-medium text-center text-card-foreground">{tool.name}</span>
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
