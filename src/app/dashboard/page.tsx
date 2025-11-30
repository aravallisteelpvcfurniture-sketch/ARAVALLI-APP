'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BottomNav } from '@/components/bottom-nav';
import { Bell } from 'lucide-react';
import Image from 'next/image';

const largeButtons = [
    { name: 'Estimate', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="12" width="24" height="28" rx="2" fill="white"/><path d="M16 18H22V20H16V18Z" fill="#F87171"/><path d="M24 18H30V20H24V18Z" fill="#F87171"/><path d="M16 23H22V25H16V23Z" fill="#F87171"/><path d="M24 23H30V25H24V23Z" fill="#F87171"/><path d="M16 28H22V30H16V28Z" fill="#F87171"/><path d="M24 28H30V30H24V28Z" fill="#F87171"/><path d="M16 33H22V35H16V33Z" fill="#F87171"/><circle cx="30" cy="34" r="4" fill="#FBBF24"/><path d="M30 32V34H32" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 31C29.4477 31 29 31.4477 29 32" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>, bgColor: 'bg-red-500' },
    { name: 'Greetings', href: '/greetings', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 22L14 26L18 30" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 22L34 26L30 30" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 18L22 34" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>, bgColor: 'bg-blue-500' },
    { name: 'Visitors', href: '/visitors', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="16" width="14" height="18" rx="2" fill="white"/><path d="M14 20H24" stroke="#FBBF24" stroke-width="2" stroke-linecap="round"/><path d="M14 24H24" stroke="#FBBF24" stroke-width="2" stroke-linecap="round"/><path d="M14 28H20" stroke="#FBBF24" stroke-width="2" stroke-linecap="round"/><path d="M30 18H36V32H30V18Z" fill="#FDE68A"/><path d="M30 22H36" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M30 28H34" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>, bgColor: 'bg-yellow-500' },
    { name: 'My Carpenter', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 14C21.3333 14.6667 20 17 20 18C20 22 28 22 28 18C28 17 26.6667 14.6667 24 14Z" fill="white"/><path d="M21 18H27V34H21V18Z" fill="#FDBA74"/><rect x="18" y="28" width="12" height="8" fill="#FFDDC1"/><path d="M29 34L29 25C29.5 23.5 31 22 31 24C31 26 29 27 29 34Z" fill="#FDBA74"/><path d="M19 34L19 25C18.5 23.5 17 22 17 24C17 26 19 27 19 34Z" fill="#FDBA74"/></svg>, bgColor: 'bg-pink-500', badge: 'New' },
    { name: 'Confirm Order List', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 14H32V36H16V14Z" fill="white"/><path d="M20 20L24 24L30 18" stroke="#A78BFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 29H30" stroke="#C4B5FD" stroke-width="2" stroke-linecap="round"/></svg>, bgColor: 'bg-purple-500' },
];

const smallButtons = [
    { name: 'Real Editor', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#FEE2E2"/><path d="M18 16L28 16C31.3137 16 34 18.6863 34 22C34 25.3137 31.3137 28 28 28L18 28" stroke="#F87171" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M24 34L18 28L24 22" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>, textColor: 'text-red-500' },
    { name: 'Carpenter Bonanza', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#DBEAFE"/><path d="M24 12C21.3333 12.6667 20 15 20 16C20 20 28 20 28 16C28 15 26.6667 12.6667 24 12Z" fill="#60A5FA"/><path d="M21 16H27V32H21V16Z" fill="#3B82F6"/><rect x="18" y="26" width="12" height="8" fill="#93C5FD"/><path d="M29 32L29 23C29.5 21.5 31 20 31 22C31 24 29 25 29 32Z" fill="#3B82F6"/><path d="M19 32L19 23C18.5 21.5 17 20 17 22C17 24 19 25 19 32Z" fill="#3B82F6"/><path d="M22 34H26V36H22V34Z" fill="#FBBF24"/><path d="M24 36V38" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/><path d="M21 38H27" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/></svg>, textColor: 'text-blue-500' },
    { name: 'Catalogue', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#DBEAFE"/><rect x="15" y="12" width="18" height="24" rx="3" fill="#60A5FA"/><path d="M19 19H29V21H19V19Z" fill="#FBBF24"/><path d="M19 24H29V26H19V24Z" fill="#FBBF24"/><path d="M19 29H25V31H19V29Z" fill="#FBBF24"/><rect x="29" y="16" width="8" height="10" rx="1" fill="#FDE68A" transform="rotate(15 29 16)"/></svg>, textColor: 'text-blue-500' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
      <header className="sticky top-0 z-10 bg-primary p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-foreground">Welcome!</h1>
          <div className="flex items-center gap-4">
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30">Check In</Button>
            <Bell className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col p-4 gap-4">
        
        <div className="relative w-full h-auto rounded-lg overflow-hidden shadow-lg">
            <Image 
                src="https://i.ibb.co/L86v3SY/image.png"
                alt="Carpenter Bonanza Offer"
                width={746}
                height={736}
                layout="responsive"
            />
        </div>

        <div className="grid grid-cols-3 gap-4">
            {largeButtons.slice(0,3).map((tool) => (
                <Link href={tool.href} key={tool.name} className="relative">
                    <Card className={`${tool.bgColor} hover:opacity-90 transition-opacity h-full rounded-xl shadow-sm aspect-square`}>
                        <CardContent className="flex flex-col items-center justify-center p-2 gap-2 h-full">
                            <div className="w-12 h-12 flex items-center justify-center">
                                {tool.icon}
                            </div>
                            <span className="text-sm font-bold text-center text-white">{tool.name}</span>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
            {largeButtons.slice(3,5).map((tool) => (
                <Link href={tool.href} key={tool.name} className="relative">
                    <Card className={`${tool.bgColor} hover:opacity-90 transition-opacity h-full rounded-xl shadow-sm`}>
                        <CardContent className="flex flex-col items-center justify-center p-2 gap-2 h-full aspect-video">
                            <div className="w-12 h-12 flex items-center justify-center">
                                {tool.icon}
                            </div>
                            <span className="text-sm font-bold text-center text-white">{tool.name}</span>
                        </CardContent>
                    </Card>
                    {tool.badge && <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg z-10 shadow-md">{tool.badge}</div>}
                </Link>
            ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
            {smallButtons.map((tool) => (
                <Link href={tool.href} key={tool.name} className="relative">
                    <Card className="bg-card hover:bg-card/90 transition-colors h-full rounded-xl shadow-sm aspect-square">
                        <CardContent className="flex flex-col items-center justify-center p-2 gap-2 h-full">
                            <div className="w-12 h-12 flex items-center justify-center">
                                {tool.icon}
                            </div>
                            <span className={`text-xs font-medium text-center ${tool.textColor || 'text-card-foreground'}`}>{tool.name}</span>
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
