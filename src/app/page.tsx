'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthComponent } from '@/components/auth-component';
import { Loader2 } from 'lucide-react';

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
      <div className="relative flex flex-col h-dvh w-full items-center justify-center overflow-hidden bg-primary">
        <Loader2 className="h-12 w-12 animate-spin text-primary-foreground" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background">
       <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://i.ibb.co/fWnT2jw/image.png')",
        }}
      />
      <div className="absolute inset-0 z-10 bg-black/30" />
      <main className="z-20 flex flex-1 items-center justify-center p-4 w-full">
        <AuthComponent />
      </main>
    </div>
  );
}
