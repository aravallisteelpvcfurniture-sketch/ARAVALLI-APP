'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthComponent } from '@/components/auth-component';
import { AravalliLogo } from '@/components/aravalli-logo';

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
      <div className="flex flex-col min-h-dvh bg-background text-foreground items-center justify-center">
        <AravalliLogo className="h-24 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b shrink-0 bg-card">
        <div className="flex items-center justify-start gap-2">
          <AravalliLogo className="h-10" />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <AuthComponent />
      </main>
    </div>
  );
}
