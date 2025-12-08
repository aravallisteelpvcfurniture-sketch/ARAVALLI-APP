'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Phone, Mail, MapPin, Building, ChevronRight, Ruler, FileText } from 'lucide-react';
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
    { name: 'Site Measurement', href: `/visitors/${visitorId}/measurement`, icon: Ruler },
    { name: 'Quotation', href: `/visitors/${visitorId}/quotation`, icon: FileText },
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
           <Card>
            <CardContent className="p-2 space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </CardContent>
           </Card>
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
      <main className="flex-1 p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">{visitor.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <a href={`tel:${visitor.phone}`} className="text-foreground hover:underline">{visitor.phone}</a>
            </div>
            {visitor.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                 <a href={`mailto:${visitor.email}`} className="text-foreground hover:underline">{visitor.email}</a>
              </div>
            )}
            {visitor.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{visitor.address}</span>
              </div>
            )}
            {visitor.city && (
                <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-primary" />
                    <span>{visitor.city}</span>
                </div>
            )}
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-2">
                 <ul className="divide-y">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <Link href={item.href} className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors">
                                <div className="flex items-center gap-4">
                                    <item.icon className="h-6 w-6 text-primary" />
                                    <span className="font-medium">{item.name}</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </Link>
                        </li>
                    ))}
                 </ul>
            </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}
