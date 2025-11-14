'use client';

import React from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';

export default function GreetingsPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Greetings</h1>
            <p className="text-muted-foreground">
              This page is currently empty.
            </p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
