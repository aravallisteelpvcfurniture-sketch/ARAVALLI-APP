'use client';

import React from 'react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, User, Phone, MapPin, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Visitor } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function VisitorsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const visitorsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'visitors');
  }, [firestore, user?.uid]);

  const { data: visitors, isLoading } = useCollection<Visitor>(visitorsCollectionRef);

  const handleDeleteVisitor = (visitorId: string) => {
    if (!visitorsCollectionRef) return;
    const visitorDocRef = doc(visitorsCollectionRef, visitorId);
    
    deleteDocumentNonBlocking(visitorDocRef);

    toast({
      title: "Visitor Deleted",
      description: "The visitor has been removed from your list.",
    });
  };

  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
      <Header title="Visitors" />
      <main className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Client List</h1>
          <Button asChild>
            <Link href="/visitors/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Visitor
            </Link>
          </Button>
        </div>

        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && visitors && visitors.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visitors.map((visitor) => (
              <Card key={visitor.id} className="relative">
                <div className="absolute top-2 right-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the visitor
                          and all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteVisitor(visitor.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Link href={`/visitors/${visitor.id}`} className="block h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      {visitor.name}
                    </CardTitle>
                    {visitor.status && (
                      <CardDescription>Status: {visitor.status}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{visitor.phone}</span>
                    </div>
                    {visitor.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{visitor.city}</span>
                      </div>
                    )}
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && (!visitors || visitors.length === 0) && (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg bg-background">
            <p className="text-lg font-semibold">No Visitors Yet</p>
            <p className="text-sm">Click "Add Visitor" to get started.</p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
