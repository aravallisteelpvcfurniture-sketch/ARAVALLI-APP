'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { BottomNav } from '@/components/bottom-nav';
import { Bell, FileText, Gift, Users, HardHat, ClipboardList, Brush, SprayCan, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const mainTools = [
    { name: 'Estimate', href: '#', icon: FileText, color: 'bg-red-500' },
    { name: 'Greetings', href: '/greetings', icon: Gift, color: 'bg-blue-500' },
    { name: 'Visitors', href: '/visitors', icon: Users, color: 'bg-yellow-500' },
];

const secondaryTools = [
    { name: 'My Carpenter', href: '#', icon: HardHat, color: 'bg-pink-500', badge: 'New' },
    { name: 'Confirm Order List', href: '#', icon: ClipboardList, color: 'bg-purple-500' },
];

const tertiaryTools = [
    { name: 'Real Editor', href: '#', icon: Brush },
    { name: 'Carpenter Bonanza', href: '#', icon: SprayCan },
    { name: 'Catalogue', href: '#', icon: BookOpen },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-muted/30">
        <header className="bg-primary text-primary-foreground p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Welcome!</h1>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white rounded-full">Check In</Button>
                    <Bell className="h-6 w-6" />
                </div>
            </div>
        </header>
      <main className="flex-1 flex flex-col p-4 gap-4">
        <div>
            <Image 
                src="https://i.ibb.co/68gP8P2/carpenter-bonanza-offer-1.png"
                alt="Carpenter Bonanza Offer"
                width={500}
                height={300}
                className="w-full rounded-lg"
            />
        </div>

        <div className="grid grid-cols-3 gap-4">
            {mainTools.map((tool) => (
                <Link href={tool.href} key={tool.name}>
                    <Card className={`${tool.color} text-white rounded-2xl shadow-lg`}>
                        <CardContent className="flex flex-col items-center justify-center p-4 gap-2 aspect-square">
                            <tool.icon className="w-8 h-8" />
                            <span className="text-sm font-medium text-center">{tool.name}</span>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
            {secondaryTools.map((tool) => (
                <Link href={tool.href} key={tool.name} className="relative">
                     {tool.badge && <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full z-10 shadow-md">{tool.badge}</div>}
                    <Card className={`${tool.color} text-white rounded-2xl shadow-lg`}>
                        <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                             <div className="bg-white/30 p-3 rounded-full">
                                <tool.icon className="w-8 h-8" />
                            </div>
                            <span className="text-base font-semibold text-center">{tool.name}</span>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
            {tertiaryTools.map((tool) => (
                <Link href={tool.href} key={tool.name}>
                    <Card className="bg-card hover:bg-card/90 transition-colors h-full rounded-xl shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center p-4 gap-2 aspect-square">
                             <div className="w-12 h-12 flex items-center justify-center">
                                <tool.icon className="w-8 h-8 text-primary" />
                            </div>
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
