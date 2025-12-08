'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Phone, Mail, MapPin, Building, Ruler, FileText, Camera, Edit } from 'lucide-react';
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
    { name: 'Site Measurement', href: `/visitors/${visitorId}/measurement`, icon: Ruler, description: 'Take and view measurements' },
    { name: 'Quotation', href: `/visitors/${visitorId}/quotation`, icon: FileText, description: 'Create and manage quotations' },
    { name: 'Site Photo', href: `/visitors/${visitorId}/photos`, icon: Camera, description: 'Upload and view site photos' },
    { name: 'Edit Details', href: `/visitors/${visitorId}/edit`, icon: Edit, description: 'Edit client information' },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-dvh bg-muted/40">
        <Header title="Loading..." />
        <main className="flex-1 p-4 space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
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
      <main className="flex-1 p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item) => (
                <Link href={item.href} key={item.name}>
                    <Card className="h-full hover:bg-muted transition-colors shadow-md hover:shadow-lg">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                           <div className="flex items-center justify-center bg-primary/10 text-primary h-12 w-12 rounded-full mb-2">
                             <item.icon className="h-6 w-6" />
                           </div>
                           <p className="font-semibold text-sm">{item.name}</p>
                           <p className="text-xs text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
