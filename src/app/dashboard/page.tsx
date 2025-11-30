'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { BottomNav } from '@/components/bottom-nav';

const tools = [
    { 
        name: 'Real Editor', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#FEE2E2"/><path d="M18 16L28 16C31.3137 16 34 18.6863 34 22C34 25.3137 31.3137 28 28 28L18 28" stroke="#F87171" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M24 34L18 28L24 22" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
        textColor: 'text-red-500'
    },
    { 
        name: 'Carpenter Bonanza', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#DBEAFE"/><path d="M24 12C21.3333 12.6667 20 15 20 16C20 20 28 20 28 16C28 15 26.6667 12.6667 24 12Z" fill="#60A5FA"/><path d="M21 16H27V32H21V16Z" fill="#3B82F6"/><rect x="18" y="26" width="12" height="8" fill="#93C5FD"/><path d="M29 32L29 23C29.5 21.5 31 20 31 22C31 24 29 25 29 32Z" fill="#3B82F6"/><path d="M19 32L19 23C18.5 21.5 17 20 17 22C17 24 19 25 19 32Z" fill="#3B82F6"/><path d="M22 34H26V36H22V34Z" fill="#FBBF24"/><path d="M24 36V38" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/><path d="M21 38H27" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/></svg>,
        textColor: 'text-red-500'
    },
    { 
        name: 'Catalogue', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#DBEAFE"/><rect x="15" y="12" width="18" height="24" rx="3" fill="#60A5FA"/><path d="M19 19H29V21H19V19Z" fill="#FBBF24"/><path d="M19 24H29V26H19V24Z" fill="#FBBF24"/><path d="M19 29H25V31H19V29Z" fill="#FBBF24"/><rect x="29" y="16" width="8" height="10" rx="1" fill="#FDE68A" transform="rotate(15 29 16)"/></svg>
    },
    { 
        name: 'Furniture Idea', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#F3F4F6"/><rect x="12" y="24" width="16" height="10" rx="2" fill="#E5E7EB"/><rect x="14" y="26" width="12" height="6" fill="white"/><rect x="26" y="16" width="8" height="18" rx="1" fill="#A16207"/><rect x="27" y="17" width="2" height="16" fill="#CA8A04"/><path d="M30 14L30 12C30 11.4477 29.5523 11 29 11H27C26.4477 11 26 11.4477 26 12V14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><rect x="13" y="21" width="3" height="3" rx="1" fill="#F59E0B"/></svg>
    },
    { 
        name: 'Estimate', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#E0E7FF"/><rect x="22" y="20" width="14" height="16" rx="2" fill="#93C5FD"/><rect x="24" y="22" width="10" height="4" fill="#BFDBFE"/><rect x="24" y="28" width="4" height="2" fill="#60A5FA"/><rect x="30" y="28" width="4" height="2" fill="#60A5FA"/><rect x="24" y="31" width="4" height="2" fill="#60A5FA"/><rect x="30" y="31" width="4" height="2" fill="#60A5FA"/><rect x="24" y="34" width="10" height="2" fill="#60A5FA"/><path d="M12 12H28V18H12V12Z" fill="#F87171"/><path d="M12 12V36L18 30C18 30 20 28 22 28C24 28 26 30 26 30L32 36V20L12 12Z" fill="#FCA5A5"/><path d="M22 28C22.6667 28.6667 24 30 24 30C24 30 25.3333 28.6667 26 28" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round"/><path d="M19 22C17.8954 22 17 22.8954 17 24C17 25.1046 17.8954 26 19 26C20.1046 26 21 25.1046 21 24C21 22.8954 20.1046 22 19 22Z" fill="#FDE047"/><path d="M19 22C20.1046 22 21 22.8954 21 24C21 25.1046 20.1046 26 19 26" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/></svg>
    },
    { 
        name: 'Video/Reels', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#E0E7FF"/><rect x="12" y="15" width="24" height="18" rx="2" fill="#A5B4FC"/><rect x="12" y="17" width="24" height="2" fill="#4338CA"/><circle cx="16" cy="16" r="1" fill="#4F46E5"/><circle cx="19" cy="16" r="1" fill="#4F46E5"/><path d="M21 24L26 21V27L21 24Z" fill="white"/></svg>
    },
    { 
        name: 'News', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#FEF3C7"/><rect x="12" y="12" width="24" height="24" rx="2" fill="#FDE68A"/><path d="M16 16H24V18H16V16Z" fill="#FBBF24"/><path d="M26 16H32V22H26V16Z" fill="#FCD34D"/><path d="M16 20H24V22H16V20Z" fill="#FBBF24"/><path d="M16 24H32V26H16V24Z" fill="#FBBF24"/><path d="M16 28H32V30H16V28Z" fill="#FBBF24"/></svg>
    },
    { 
        name: 'Offer', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#FEF3C7"/><path d="M14 20H34V34H14V20Z" fill="#FCD34D"/><path d="M12 20H36L34 16H14L12 20Z" fill="#FBBF24"/><path d="M24 12L28 16H20L24 12Z" fill="#F87171"/><path d="M22 16H26V20H22V16Z" fill="#FB923C"/><circle cx="28" cy="25" r="3" fill="white"/><path d="M29.5 23.5L26.5 26.5" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round"/><circle cx="27" cy="24" r="0.5" fill="#F87171"/><circle cx="29" cy="26" r="0.5" fill="#F87171"/></svg>
    },
    { 
        name: 'My Gift', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#FCE7F3"/><path d="M14 24H34V32H14V24Z" fill="#F9A8D4"/><path d="M12 24H36L34 20H14L12 24Z" fill="#F472B6"/><path d="M24 16L28 20H20L24 16Z" fill="#FCD34D"/><path d="M22 20H26V24H22V20Z" fill="#F9A8D4"/><path d="M14 24L18 20" stroke="#F472B6" strokeWidth="2"/><path d="M34 24L30 20" stroke="#F472B6" strokeWidth="2"/><path d="M12 34H36" stroke="#4C1D95" strokeWidth="2" strokeLinecap="round"/></svg>
    },
    { 
        name: 'Scan History', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#D1FAE5"/><path d="M16 16H20V20H16V16Z" fill="#34D399"/><path d="M28 16H32V20H28V16Z" fill="#34D399"/><path d="M16 28H20V32H16V28Z" fill="#34D399"/><path d="M28 28H32V32H28V28Z" fill="#34D399"/><path d="M22 18H26V22H22V18Z" fill="#A7F3D0"/><path d="M22 26H26V30H22V26Z" fill="#A7F3D0"/><path d="M18 22H22V26H18V22Z" fill="#A7F3D0"/><path d="M26 22H30V26H26V22Z" fill="#A7F3D0"/><path d="M12 20V28" stroke="#10B981" strokeWidth="4" strokeLinecap="round"/><path d="M36 20V28" stroke="#10B981" strokeWidth="4" strokeLinecap="round"/><path d="M20 12H28" stroke="#10B981" strokeWidth="4" strokeLinecap="round"/><path d="M20 36H28" stroke="#10B981" strokeWidth="4" strokeLinecap="round"/></svg>
    },
    { 
        name: 'More', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#FEF3C7"/><rect x="16" y="16" width="8" height="8" rx="2" fill="#FCD34D"/><rect x="26" y="16" width="8" height="8" rx="2" fill="#FCD34D"/><rect x="16" y="26" width="8" height="8" rx="2" fill="#FCD34D"/><rect x="26" y="26" width="8" height="8" rx="2" fill="#FCD34D"/></svg>
    },
    { 
        name: 'Order Form', 
        href: '#', 
        icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="40" height="40" rx="10" fill="#ECFCCB"/><path d="M18 16H34V34H18V16Z" fill="white"/><path d="M21 21L25 25L31 19" stroke="#84CC16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 29H31" stroke="#A3E635" strokeWidth="2" strokeLinecap="round"/><path d="M28 14L30 12" stroke="#4D7C0F" strokeWidth="2" strokeLinecap="round"/><path d="M14 28H12V32H16V30" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/><path d="M16 32L12 36L14 38L18 34" stroke="#FB923C" strokeWidth="2" strokeLinecap="round"/><rect x="12" y="30" width="4" height="4" fill="#FDE68A"/></svg>,
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
                    {tool.badge && <div className="absolute top-0 right-0 bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10 shadow-md -translate-y-1/2 translate-x-1/4">{tool.badge}</div>}
                </Link>
            ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
