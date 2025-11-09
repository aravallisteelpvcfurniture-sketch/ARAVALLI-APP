'use client';

import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto">
        {/* The main content of the dashboard will go here. */}
      </main>
      <BottomNav />
    </div>
  );
}
