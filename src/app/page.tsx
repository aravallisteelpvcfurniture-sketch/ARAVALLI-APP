'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthComponent } from '@/components/auth-component';
import { AravalliLogo } from '@/components/aravalli-logo';
import Image from 'next/image';

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
       <div className="relative flex flex-col h-dvh w-full items-center justify-center overflow-hidden">
        <Image
          src="https://i.ibb.co/3s6t9sL/a.jpg"
          alt="Modern kitchen background"
          layout="fill"
          objectFit="cover"
          className="absolute z-0"
          data-ai-hint="modern kitchen"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="z-20">
            <AravalliLogo className="w-64 h-auto" />
        </div>
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
