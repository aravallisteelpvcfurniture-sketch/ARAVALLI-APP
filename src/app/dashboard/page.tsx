'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { BottomNav } from '@/components/bottom-nav';

const tools = [
    {
        name: 'Real Editor',
        href: '#',
        icon: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="10" fill="white"/>
                <rect x="12" y="8" width="24" height="32" rx="6" fill="url(#paint0_linear_1_1)"/>
                <path d="M22.9999 15.5C23.9999 14.5 25.5 15 26.5 16.5C27.5 18 27.5 29.5 22.9999 33.5C18.4999 37.5 18.9999 26 19.4999 22C19.9999 18 21.9999 16.5 22.9999 15.5Z" fill="white"/>
            </svg>
        ),
        textColor: 'text-red-500'
    },
    { name: 'Carpenter Bonanza', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><path d="M24 12C21.3333 12.6667 20 15 20 16C20 20 28 20 28 16C28 15 26.6667 12.6667 24 12Z" fill="#60A5FA"/><path d="M21 16H27V32H21V16Z" fill="#3B82F6"/><rect x="18" y="26" width="12" height="8" fill="#93C5FD"/><path d="M29 32L29 23C29.5 21.5 31 20 31 22C31 24 29 25 29 32Z" fill="#3B82F6"/><path d="M19 32L19 23C18.5 21.5 17 20 17 22C17 24 19 25 19 32Z" fill="#3B82F6"/><path d="M22 34H26V36H22V34Z" fill="#FBBF24"/><path d="M24 36V38" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/><path d="M21 38H27" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/></svg>, textColor: 'text-red-500' },
    { name: 'Catalogue', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="15" y="12" width="18" height="24" rx="3" fill="#60A5FA"/><path d="M19 19H29V21H19V19Z" fill="#FBBF24"/><path d="M19 24H29V26H19V24Z" fill="#FBBF24"/><path d="M19 29H25V31H19V29Z" fill="#FBBF24"/><rect x="29" y="16" width="8" height="10" rx="1" fill="#FDE68A" transform="rotate(15 29 16)"/></svg> },
    { name: 'Furniture Idea', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="12" y="24" width="16" height="10" rx="2" fill="#E5E7EB"/><rect x="14" y="26" width="12" height="6" fill="#F3F4F6"/><rect x="26" y="16" width="8" height="18" rx="1" fill="#A16207"/><rect x="27" y="17" width="2" height="16" fill="#CA8A04"/><path d="M30 14L30 12C30 11.4477 29.5523 11 29 11H27C26.4477 11 26 11.4477 26 12V14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><rect x="13" y="21" width="3" height="3" rx="1" fill="#F59E0B"/></svg> },
    { name: 'Estimate', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="22" y="20" width="14" height="16" rx="2" fill="#93C5FD"/><rect x="24" y="22" width="10" height="4" fill="#BFDBFE"/><rect x="24" y="28" width="4" height="2" fill="#60A5FA"/><rect x="30" y="28" width="4" height="2" fill="#60A5FA"/><rect x="24" y="31" width="4" height="2" fill="#60A5FA"/><rect x="30" y="31" width="4" height="2" fill="#60A5FA"/><rect x="24" y="34" width="10" height="2" fill="#60A5FA"/><path d="M12 12H28V18H12V12Z" fill="#F87171"/><path d="M12 12V36L18 30C18 30 20 28 22 28C24 28 26 30 26 30L32 36V20L12 12Z" fill="#FCA5A5"/><path d="M22 28C22.6667 28.6667 24 30 24 30C24 30 25.3333 28.6667 26 28" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round"/><path d="M19 22C17.8954 22 17 22.8954 17 24C17 25.1046 17.8954 26 19 26C20.1046 26 21 25.1046 21 24C21 22.8954 20.1046 22 19 22Z" fill="#FDE047"/><path d="M19 22C20.1046 22 21 22.8954 21 24C21 25.1046 20.1046 26 19 26" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { name: 'Video/Reels', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="12" y="14" width="24" height="18" rx="2" fill="#60A5FA"/><rect x="12" y="18" width="24" height="2" fill="#3B82F6"/><path d="M21 24L26 27.5L21 31V24Z" fill="#F87171"/><circle cx="15" cy="16" r="1" fill="white"/><circle cx="18" cy="16" r="1" fill="white"/><circle cx="21" cy="16" r="1" fill="white"/><rect x="14" y="34" width="20" height="2" fill="#E5E7EB"/></svg> },
    { name: 'News', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="12" y="12" width="24" height="24" rx="2" fill="#FDE68A"/><rect x="14" y="14" width="20" height="4" fill="#FBBF24"/><path d="M14 20H24V22H14V20Z" fill="#FBBF24"/><path d="M26 20H34V28H26V20Z" fill="#60A5FA"/><path d="M14 24H24V26H14V24Z" fill="#60A5FA"/><path d="M14 28H24V30H14V28Z" fill="#60A5FA"/><path d="M14 32H34V34H14V32Z" fill="#FBBF24"/></svg> },
    { name: 'Offer', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="12" y="20" width="24" height="16" rx="2" fill="#FBBF24"/><rect x="12" y="18" width="24" height="4" fill="#F87171"/><rect x="22" y="14" width="4" height="4" fill="#F87171"/><path d="M18 14C18 12.8954 18.8954 12 20 12H28C29.1046 12 30 12.8954 30 14V18H18V14Z" fill="#F87171"/><circle cx="24" cy="28" r="5" fill="#F87171"/><path d="M25.5 26L22.5 30" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="23" cy="26" r="0.5" fill="white"/><circle cx="25" cy="30" r="0.5" fill="white"/></svg> },
    { name: 'My Gift', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><path d="M12 28H20V36H12V28Z" fill="#4F46E5"/><path d="M13 36V38C13 39.1046 13.8954 40 15 40H17C18.1046 40 19 39.1046 19 38V36" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/><rect x="16" y="18" width="18" height="12" fill="#F472B6"/><rect x="16" y="22" width="18" height="4" fill="#FBBF24"/><path d="M28 14C28 12.8954 28.8954 12 30 12H32C33.1046 12 34 12.8954 34 14V18H28V14Z" fill="#FBBF24"/><path d="M22 14C22 12.8954 21.1046 12 20 12H18C16.8954 12 16 12.8954 16 14V18H22V14Z" fill="#FBBF24"/></svg> },
    { name: 'Scan History', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><path d="M16 16H18V18H16V16Z" fill="#059669"/><path d="M16 22H18V24H16V22Z" fill="#059669"/><path d="M16 28H18V30H16V28Z" fill="#059669"/><path d="M22 16H24V18H22V16Z" fill="#059669"/><path d="M22 22H24V24H22V22Z" fill="#059669"/><path d="M22 28H24V30H22V28Z" fill="#059669"/><path d="M28 16H30V18H28V16Z" fill="#059669"/><path d="M28 22H30V24H28V22Z" fill="#059669"/><path d="M28 28H30V30H28V28Z" fill="#059669"/><path d="M12 20V16C12 13.7909 13.7909 12 16 12H20" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/><path d="M28 12H32C34.2091 12 36 13.7909 36 16V20" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/><path d="M36 28V32C36 34.2091 34.2091 36 32 36H28" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/><path d="M20 36H16C13.7909 36 12 34.2091 12 32V28" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/></svg> },
    { name: 'More', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="white"/><rect x="15" y="15" width="8" height="8" rx="2" fill="#FBBF24"/><rect x="25" y="15" width="8" height="8" rx="2" fill="#FBBF24"/><rect x="15" y="25" width="8" height="8" rx="2" fill="#FBBF24"/><rect x="25" y="25" width="8" height="8" rx="2" fill="#FBBF24"/></svg> },
    { name: 'Order Form', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_1_2)"><rect width="48" height="48" rx="10" fill="white"/><path d="M30 36L34 32" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/><path d="M20 30L24 26L32 34L28 38L20 30Z" fill="#FDE68A" stroke="#FBBF24" strokeWidth="2"/><rect x="20" y="30" width="12" height="1" fill="#FBBF24"/><path d="M19 22L28 13L35 20L26 29L19 22Z" fill="white" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M26 15L33 22" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 26L22.5 23.5" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.5 17.5L23 15" stroke="#F87171" strokeWidth="2" strokeLinecap="round"/><path d="M23.5 20.5L26 18" stroke="#F87171" strokeWidth="2" strokeLinecap="round"/></g><defs><clipPath id="clip0_1_2"><rect width="48" height="48" rx="10" fill="white"/></clipPath><paint0_linear_1_1 id="paint0_linear_1_1" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#F97316"/><stop offset="1" stopColor="#EA580C"/></paint0_linear_1_1></defs></svg>, badge: 'New' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-muted/30">
        
      <main className="flex-1 flex flex-col p-4">
        <div className="grid grid-cols-3 gap-4">
            {tools.map((tool) => (
                <Link href={tool.href} key={tool.name} className='relative'>
                    {tool.badge && <div className="absolute top-1 right-1 bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full z-10 shadow-md">{tool.badge}</div>}
                    <Card className="bg-card hover:bg-card/90 transition-colors h-full rounded-xl shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center p-4 gap-2 aspect-square">
                            <div className="w-12 h-12">
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
