'use client';

import React from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


export default function VisitorsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const visitorsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'visitors');
  }, [firestore, user?.uid]);

  const { data: visitors, isLoading: isVisitorsLoading } = useCollection(visitorsCollectionRef);

  const isLoading = isUserLoading || isVisitorsLoading;

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header title="Visitors" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Visitor List</h1>
          <Button asChild>
            <Link href="/visitors/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Visitor
            </Link>
          </Button>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : visitors && visitors.length > 0 ? (
            visitors.map((visitor) => (
                <Card key={visitor.id} className="rounded-2xl">
                <CardContent className="p-0">
                    <Link href={`/visitors/${visitor.id}`} className="flex items-center justify-between p-4 group">
                    <span className="font-medium">{visitor.name}</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                </CardContent>
                </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48 border-2 border-dashed rounded-lg">
                <p className="font-semibold">No Visitors Found</p>
                <p className="text-sm">Click "Add Visitor" to create your first one.</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
