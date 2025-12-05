'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MeasurementPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-dvh bg-muted text-foreground">
       <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Site Measurement</h1>
        </div>
        <div className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
            <p>Site Measurement Page</p>
            <p className="text-sm">Ready for your new requirements.</p>
        </div>
      </main>
    </div>
  );
}
