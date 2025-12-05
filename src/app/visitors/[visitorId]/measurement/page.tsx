'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Bell } from 'lucide-react';

export default function MeasurementPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-dvh bg-gray-100 dark:bg-gray-800">
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
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
            <p>This page is ready for your instructions.</p>
        </div>
      </main>
    </div>
  );
}
