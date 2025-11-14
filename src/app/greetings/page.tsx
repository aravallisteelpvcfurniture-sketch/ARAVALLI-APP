'use client';

import React from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';

export default function GreetingsPage() {
    return (
        <div className="flex flex-col min-h-dvh bg-background text-foreground">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {/* Content has been removed as per your request */}
            </main>
            <BottomNav />
        </div>
    );
}
