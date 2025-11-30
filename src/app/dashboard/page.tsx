'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { BottomNav } from '@/components/bottom-nav';

const tools = [
    { 
        name: 'Real Editor', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><path d="M18 16L28 16C31.3137 16 34 18.6863 34 22C34 25.3137 31.3137 28 28 28L18 28" stroke="#F87171" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M24 34L18 28L24 22" stroke="#F87171" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>, 
        textColor: 'text-red-500' 
    },
    { 
        name: 'Carpenter Bonanza', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><path d="M24 12C21.3333 12.6667 20 15 20 16C20 20 28 20 28 16C28 15 26.6667 12.6667 24 12Z" fill="#60A5FA"/><path d="M21 16H27V32H21V16Z" fill="#3B82F6"/><rect x="18" y="26" width="12" height="8" fill="#93C5FD"/><path d="M29 32L29 23C29.5 21.5 31 20 31 22C31 24 29 25 29 32Z" fill="#3B82F6"/><path d="M19 32L19 23C18.5 21.5 17 20 17 22C17 24 19 25 19 32Z" fill="#3B82F6"/><path d="M22 34H26V36H22V34Z" fill="#FBBF24"/><path d="M24 36V38" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/><path d="M21 38H27" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/></svg>,
        textColor: 'text-red-500' 
    },
    { 
        name: 'Catalogue', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="15" y="12" width="18" height="24" rx="3" fill="#60A5FA"/><path d="M19 19H29V21H19V19Z" fill="#FBBF24"/><path d="M19 24H29V26H19V24Z" fill="#FBBF24"/><path d="M19 29H25V31H19V29Z" fill="#FBBF24"/><rect x="29" y="16" width="8" height="10" rx="1" fill="#FDE68A" transform="rotate(15 29 16)"/></svg> 
    },
    { 
        name: 'Furniture Idea', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="12" y="24" width="16" height="10" rx="2" fill="#E5E7EB"/><rect x="14" y="26" width="12" height="6" fill="#F3F4F6"/><rect x="26" y="16" width="8" height="18" rx="1" fill="#A16207"/><rect x="27" y="17" width="2" height="16" fill="#CA8A04"/><path d="M30 14L30 12C30 11.4477 29.5523 11 29 11H27C26.4477 11 26 11.4477 26 12V14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><rect x="13" y="21" width="3" height="3" rx="1" fill="#F59E0B"/></svg> 
    },
    { 
        name: 'Estimate', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="22" y="20" width="14" height="16" rx="2" fill="#93C5FD"/><rect x="24" y="22" width="10" height="4" fill="#BFDBFE"/><rect x="24" y="28" width="4" height="2" fill="#60A5FA"/><rect x="30" y="28" width="4" height="2" fill="#60A5FA"/><rect x="24" y="31" width="4" height="2" fill="#60A5FA"/><rect x="30" y="31" width="4" height="2" fill="#60A5FA"/><rect x="24" y="34" width="10" height="2" fill="#60A5FA"/><path d="M12 12H28V18H12V12Z" fill="#F87171"/><path d="M12 12V36L18 30C18 30 20 28 22 28C24 28 26 30 26 30L32 36V20L12 12Z" fill="#FCA5A5"/><path d="M22 28C22.6667 28.6667 24 30 24 30C24 30 25.3333 28.6667 26 28" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round"/><path d="M19 22C17.8954 22 17 22.8954 17 24C17 25.1046 17.8954 26 19 26C20.1046 26 21 25.1046 21 24C21 22.8954 20.1046 22 19 22Z" fill="#FDE047"/><path d="M19 22C20.1046 22 21 22.8954 21 24C21 25.1046 20.1046 26 19 26" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/></svg>
    },
    { 
        name: 'Video/Reels', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="12" y="14" width="24" height="20" rx="3" fill="#D1D5DB"/><path d="M20 20L28 24L20 28V20Z" fill="white"/><rect x="16" y="30" width="16" height="2" rx="1" fill="#E5E7EB"/></svg> 
    },
    { 
        name: 'News', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="12" y="12" width="24" height="24" rx="2" fill="#E0E7FF"/><path d="M16 18H32" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/><path d="M16 24H32" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round"/><path d="M16 30H24" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round"/></svg> 
    },
    { 
        name: 'Offer', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><path d="M12 24L24 12L36 24L24 36L12 24Z" fill="#FBCFE8"/><path d="M24 24L30 18L36 24L30 30L24 24Z" fill="#F9A8D4"/><path d="M24 24L18 30L12 24L18 18L24 24Z" fill="#F472B6"/><circle cx="24" cy="24" r="3" fill="white"/><circle cx="24" cy="24" r="1.5" fill="#DB2777"/></svg> 
    },
    { 
        name: 'My Gift', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="12" y="20" width="24" height="16" rx="2" fill="#F87171"/><path d="M12 20L24 28L36 20" stroke="#FECACA" strokeWidth="2"/><path d="M24 20V36" stroke="#FECACA" strokeWidth="2"/><rect x="20" y="14" width="8" height="6" rx="2" fill="#FCA5A5"/><path d="M20 16C20 14.8954 19.1046 14 18 14C16.8954 14 16 14.8954 16 16V20H20V16Z" fill="#FCA5A5"/><path d="M28 16C28 14.8954 28.8954 14 30 14C31.1046 14 32 14.8954 32 16V20H28V16Z" fill="#FCA5A5"/></svg> 
    },
    { 
        name: 'Scan History', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><path d="M16 16H20V12" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M32 16H28V12" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 32H20V36" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M32 32H28V36" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 24H30" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round"/><path d="M24 18V30" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round"/></svg>
    },
    { 
        name: 'More', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><circle cx="18" cy="24" r="2.5" fill="#A5B4FC"/><circle cx="24" cy="24" r="2.5" fill="#818CF8"/><circle cx="30" cy="24" r="2.5" fill="#6366F1"/></svg> 
    },
    { 
        name: 'Order Form', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="13" y="12" width="22" height="24" rx="2" fill="#FBCFE8"/><path d="M17 18H29" stroke="#F472B6" strokeWidth="2" strokeLinecap="round"/><path d="M17 24H29" stroke="#F9A8D4" strokeWidth="2" strokeLinecap="round"/><path d="M17 30H23" stroke="#F9A8D4" strokeWidth="2" strokeLinecap="round"/></svg>, 
        badge: 'New' 
    },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
      <main className="flex-1 flex flex-col p-4 gap-4">
        <div className="grid grid-cols-3 gap-4">
            {tools.map((tool) => (
                <Link href={tool.href} key={tool.name} className="relative">
                    <Card className="bg-card hover:bg-card/90 transition-colors h-full rounded-xl shadow-sm aspect-square">
                        <CardContent className="flex flex-col items-center justify-center p-2 gap-2 h-full">
                            <div className="w-12 h-12 flex items-center justify-center">
                                {tool.icon}
                            </div>
                            <span className={`text-xs font-medium text-center ${tool.textColor || 'text-card-foreground'}`}>{tool.name}</span>
                        </CardContent>
                    </Card>
                    {tool.badge && <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg z-10 shadow-md">{tool.badge}</div>}
                </Link>
            ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
