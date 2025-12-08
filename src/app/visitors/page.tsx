'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
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
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';

export default function VisitorsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [visitorToDelete, setVisitorToDelete] = useState<any | null>(null);

  const visitorsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'visitors');
  }, [firestore, user?.uid]);

  const { data: visitors, isLoading: isVisitorsLoading } = useCollection(visitorsCollectionRef);

  const isLoading = isUserLoading || isVisitorsLoading;

  const handleDeleteVisitor = () => {
    if (!visitorToDelete || !firestore || !user?.uid) return;
    
    const visitorDocRef = doc(firestore, 'users', user.uid, 'visitors', visitorToDelete.id);
    deleteDocumentNonBlocking(visitorDocRef);
    
    toast({
      title: 'Visitor Deleted',
      description: `${visitorToDelete.name} has been removed from your list.`,
    });
    setVisitorToDelete(null);
  };

  return (
    <AlertDialog>
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
                      <div className="flex items-center justify-between p-4 group">
                        <Link href={`/visitors/${visitor.id}`} className="flex-1">
                          <span className="font-medium">{visitor.name}</span>
                        </Link>
                        <div className="flex items-center">
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70" onClick={() => setVisitorToDelete(visitor)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <Link href={`/visitors/${visitor.id}`}>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </Link>
                        </div>
                      </div>
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

       <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the visitor and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setVisitorToDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteVisitor} className="bg-destructive hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
