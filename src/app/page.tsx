'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Mountain } from 'lucide-react';
import { AuthComponent } from '@/components/auth-component';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isUserLoading) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex flex-col min-h-dvh bg-background text-foreground">
        <header className="px-4 lg:px-6 h-16 flex items-center border-b shrink-0 bg-card">
          <div className="flex items-center justify-center gap-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-primary">Aravalli Configurator</span>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="space-y-4 w-full max-w-md p-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b shrink-0 bg-card">
        <div className="flex items-center justify-center gap-2">
          <Mountain className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold text-primary">Aravalli Configurator</span>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <AuthComponent />
      </main>
    </div>
  );
}
