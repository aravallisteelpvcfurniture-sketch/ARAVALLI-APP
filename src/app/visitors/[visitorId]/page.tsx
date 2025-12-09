'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Ruler, FileText, Camera, Edit } from 'lucide-react';
import type { Visitor } from '@/lib/types';
import Link from 'next/link';

export default function VisitorDetailPage() {
  const { visitorId } = useParams();
  const { user } = useUser();
  const firestore = useFirestore();

  const visitorDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return doc(firestore, 'users', user.uid, 'visitors', visitorId as string);
  }, [firestore, user?.uid, visitorId]);

  const { data: visitor, isLoading } = useDoc<Visitor>(visitorDocRef);

  const menuItems = [
    { name: 'Site Measurement', href: `/visitors/${visitorId}/quotation`, icon: Ruler, description: 'Take and view measurements', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
    { name: 'Quotation', href: `/visitors/${visitorId}/quotation`, icon: FileText, description: 'Create and manage quotations', bgColor: 'bg-green-100', textColor: 'text-green-600' },
    { name: 'Site Photo', href: `/visitors/${visitorId}/photos`, icon: Camera, description: 'Upload and view site photos', bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
    { name: 'Edit Details', href: `/visitors/${visitorId}/edit`, icon: Edit, description: 'Edit client information', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-dvh bg-muted/40">
        <Header title="Loading..." />
        <main className="flex-1 p-4 grid grid-cols-2 grid-rows-2 gap-4">
          <Skeleton className="h-full w-full rounded-2xl" />
          <Skeleton className="h-full w-full rounded-2xl" />
          <Skeleton className="h-full w-full rounded-2xl" />
          <Skeleton className="h-full w-full rounded-2xl" />
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="flex flex-col min-h-dvh bg-muted/40">
        <Header title="Visitor Not Found" />
        <main className="flex-1 flex items-center justify-center">
          <p>The requested visitor could not be found.</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
      <Header title={visitor.name} />
      <main className="flex-1 p-4 grid grid-cols-2 grid-rows-2 gap-4">
        {menuItems.map((item) => (
            <Link href={item.href} key={item.name} className="flex">
                <Card className="w-full h-full hover:bg-muted transition-colors shadow-md hover:shadow-lg rounded-2xl">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full">
                       <div className={`flex items-center justify-center ${item.bgColor} ${item.textColor} h-16 w-16 rounded-full mb-3`}>
                         <item.icon className="h-8 w-8" />
                       </div>
                       <p className="font-semibold text-base">{item.name}</p>
                       <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>
            </Link>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
