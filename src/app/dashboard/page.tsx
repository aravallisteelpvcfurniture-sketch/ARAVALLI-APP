'use client';

import { Bell, Users } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/bottom-nav';
import { DashboardCarousel } from '@/components/dashboard-carousel';

const topTools = [
  { name: 'Estimate', href: '#', icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="11" y="8" width="18" height="24" rx="2" fill="white" fillOpacity="0.8"/><path d="M14 13H26" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/><path d="M14 17H26" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/><path d="M14 21H20" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/><rect x="19" y="24" width="8" height="8" rx="1" fill="white" fillOpacity="0.8"/><path d="M23 25C22.4477 25 22 25.4477 22 26V26.5M23 31C23.5523 31 24 30.5523 24 30V29.5M21 27.5H25M22.5 29H24.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/><circle cx="23" cy="28" r="3.5" stroke="#EF4444" strokeWidth="1.5"/><path d="M23 26.5V28C23 28.2761 22.7761 28.5 22.5 28.5H22" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/></svg>, bgColor: 'bg-red-500' },
  { name: 'Greetings', href: '/greetings', icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 13H13V19H16.5M16.5 13H20V19H16.5M16.5 13C16.5 10.2386 18.7386 8 21.5 8C24.2614 8 26.5 10.2386 26.5 13V19H29.5V13H26.5M16.5 19V26C16.5 28.7614 18.7386 31 21.5 31C24.2614 31 26.5 28.7614 26.5 26V19M16.5 19H26.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, bgColor: 'bg-blue-500' },
  { name: 'Visitors', href: '/visitors', icon: <Users className="h-10 w-10 text-white" />, bgColor: 'bg-green-500' },
  { name: 'My Carpenter', href: '#', icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="13" rx="4" ry="2" fill="white"/><rect x="17" y="15" width="6" height="10" fill="white"/><path d="M15 25H25V28H15V25Z" fill="white"/><path d="M20 28V31" stroke="white" strokeWidth="2" strokeLinecap="round"/><rect x="17.5" y="12" width="5" height="3" fill="#FFC107"/><path d="M19 12V10H21V12" stroke="#FFC107" strokeWidth="1"/></svg>, bgColor: 'bg-pink-500', badge: 'New' },
  { name: 'Confirm Order List', href: '#', icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="9" width="16" height="22" rx="2" fill="white" fillOpacity="0.9"/><path d="M16 14H24" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/><path d="M16 19H24" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/><path d="M16 24H20" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/><path d="M26 9.5L28 11.5L26 13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, bgColor: 'bg-purple-600' },
];

const bottomTools = [
    { name: 'Real Editor', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="12" width="16" height="24" rx="3" fill="#FFEDD5"/><path d="M21 18L27 24L21 30V18Z" fill="#FB923C"/><rect x="19" y="15" width="10" height="3" rx="1.5" fill="#FED7AA"/><rect x="19" y="30" width="10" height="3" rx="1.5" fill="#FED7AA"/></svg>, textColor: 'text-red-500' },
    { name: 'Carpenter Bonanza', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 34V20C16 17.7909 17.7909 16 20 16H28C30.2091 16 32 17.7909 32 20V34H16Z" fill="#D1FAE5"/><path d="M20 16L18 12L22 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M28 16L30 12L26 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="22" y="22" width="4" height="8" rx="1" fill="#34D399"/><circle cx="24" cy="20" r="1.5" fill="#A7F3D0"/><path d="M18 34H30" stroke="#065F46" strokeWidth="2" strokeLinecap="round"/></svg> },
    { name: 'Catalogue', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="12" width="18" height="24" rx="3" fill="#DBEAFE"/><path d="M19 19H29V21H19V19Z" fill="#60A5FA"/><path d="M19 24H29V26H19V24Z" fill="#93C5FD"/><path d="M19 29H25V31H19V29Z" fill="#93C5FD"/><rect x="29" y="16" width="8" height="10" rx="1" fill="#BFDBFE" transform="rotate(15 29 16)"/></svg> },
    { name: 'Furniture Idea', href: '/furniture-ideas', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="24" width="16" height="10" rx="2" fill="#E5E7EB"/><rect x="14" y="26" width="12" height="6" fill="#F3F4F6"/><rect x="26" y="16" width="8" height="18" rx="1" fill="#A16207"/><rect x="27" y="17" width="2" height="16" fill="#CA8A04"/><path d="M30 14L30 12C30 11.4477 29.5523 11 29 11H27C26.4477 11 26 11.4477 26 12V14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><rect x="13" y="21" width="3" height="3" rx="1" fill="#F59E0B"/></svg> },
    { name: 'Estimate', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="22" y="20" width="14" height="16" rx="2" fill="#93C5FD"/><rect x="24" y="22" width="10" height="4" fill="#BFDBFE"/><rect x="24" y="28" width="4" height="2" fill="#60A5FA"/><rect x="30" y="28" width="4" height="2" fill="#60A5FA"/><rect x="24" y="31" width="4" height="2" fill="#60A5FA"/><rect x="30" y="31" width="4" height="2" fill="#60A5FA"/><rect x="24" y="34" width="10" height="2" fill="#60A5FA"/><path d="M12 12H28V18H12V12Z" fill="#F87171"/><path d="M12 12V36L18 30C18 30 20 28 22 28C24 28 26 30 26 30L32 36V20L12 12Z" fill="#FCA5A5"/><path d="M22 28C22.6667 28.6667 24 30 24 30C24 30 25.3333 28.6667 26 28" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round"/><path d="M19 22C17.8954 22 17 22.8954 17 24C17 25.1046 17.8954 26 19 26C20.1046 26 21 25.1046 21 24C21 22.8954 20.1046 22 19 22Z" fill="#FDE047"/><path d="M19 22C20.1046 22 21 22.8954 21 24C21 25.1046 20.1046 26 19 26" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { name: 'Video/Reels', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="14" width="24" height="20" rx="3" fill="#D1D5DB"/><path d="M20 20L28 24L20 28V20Z" fill="white"/><rect x="16" y="30" width="16" height="2" rx="1" fill="#E5E7EB"/></svg> },
    { name: 'News', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="12" width="24" height="24" rx="2" fill="#E0E7FF"/><path d="M16 18H32" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/><path d="M16 24H32" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round"/><path d="M16 30H24" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round"/></svg> },
    { name: 'Offer', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="16" width="24" height="18" rx="2" fill="#FEE2E2"/><rect x="12" y="20" width="24" height="2" fill="#FECACA"/><path d="M24 16V34" stroke="#F87171" strokeWidth="2"/><path d="M28 22C28 20.8954 27.1046 20 26 20H22C20.8954 20 20 20.8954 20 22V26C20 27.1046 20.8954 28 22 28H26C27.1046 28 28 27.1046 28 26V22Z" fill="#F87171"/><circle cx="24" cy="24" r="1" fill="white"/><circle cx="21" cy="16" r="2" fill="#FCA5A5"/><circle cx="27" cy="16" r="2" fill="#FCA5A5"/></svg> },
    { name: 'My Gift', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="20" width="24" height="16" rx="2" fill="#F87171"/><path d="M12 20L24 28L36 20" stroke="#FECACA" strokeWidth="2"/><path d="M24 20V36" stroke="#FECACA" strokeWidth="2"/><rect x="20" y="14" width="8" height="6" rx="2" fill="#FCA5A5"/><path d="M20 16C20 14.8954 19.1046 14 18 14C16.8954 14 16 14.8954 16 16V20H20V16Z" fill="#FCA5A5"/><path d="M28 16C28 14.8954 28.8954 14 30 14C31.1046 14 32 14.8954 32 16V20H28V16Z" fill="#FCA5A5"/></svg> },
    { name: 'Scan History', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 16H20V12" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M32 16H28V12" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 32H20V36" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M32 32H28V36" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 24H30" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round"/><path d="M24 18V30" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round"/></svg> },
    { name: 'More', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="14" width="8" height="8" rx="2" fill="#FEF3C7"/><rect x="14" y="26" width="8" height="8" rx="2" fill="#FEF3C7"/><rect x="26" y="14" width="8" height="8" rx="2" fill="#FEF3C7"/><rect x="26" y="26" width="8" height="8" rx="2" fill="#FEF3C7"/></svg> },
    { name: 'Order Form', href: '#', icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="13" y="12" width="22" height="24" rx="2" fill="#F3E8FF"/><path d="M17 18H29" stroke="#A855F7" strokeWidth="2" strokeLinecap="round"/><path d="M17 24H29" stroke="#C084FC" strokeWidth="2" strokeLinecap="round"/><path d="M17 30H23" stroke="#C084FC" strokeWidth="2" strokeLinecap="round"/><path d="M33 28L36 31L33 34" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M31 29H35" stroke="#34D399" strokeWidth="2" strokeLinecap="round"/><path d="M33 26V30" stroke="#34D399" strokeWidth="2" strokeLinecap="round"/></svg>, badge: 'New' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-muted">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Welcome!</h1>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white rounded-full">Check In</Button>
            <Bell className="h-6 w-6" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 gap-4">
        <DashboardCarousel />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {topTools.map((tool) => (
            <Link href={tool.href} key={tool.name} className="relative">
              <div className={`rounded-xl shadow-sm p-4 flex flex-col items-center justify-center gap-2 h-28 ${tool.bgColor}`}>
                <div className="text-primary-foreground">{tool.icon}</div>
                <span className="text-sm font-semibold text-primary-foreground">{tool.name}</span>
                 {tool.badge && <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg z-10 shadow-md">{tool.badge}</div>}
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {bottomTools.map((tool) => (
            <Link href={tool.href} key={tool.name} className="relative">
              <Card className="bg-card hover:bg-card/90 transition-colors h-full rounded-xl shadow-sm aspect-square">
                <CardContent className="flex flex-col items-center justify-center p-2 gap-2 h-full">
                  <div className="w-12 h-12 flex items-center justify-center">
                    {tool.icon}
                  </div>
                  <span className={`text-xs font-medium text-center ${tool.textColor || 'text-card-foreground'}`}>{tool.name}</span>
                </CardContent>
              </Card>
              {tool.badge && <div className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-md">{tool.badge}</div>}
            </Link>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
