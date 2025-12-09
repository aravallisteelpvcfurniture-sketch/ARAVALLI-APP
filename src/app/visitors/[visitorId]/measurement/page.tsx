'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MeasurementForm } from '@/components/measurement-form';
import type { SiteMeasurement } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
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

export default function SiteMeasurementPage() {
  const { visitorId } = useParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const measurementsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return collection(firestore, 'users', user.uid, 'visitors', visitorId as string, 'measurements');
  }, [firestore, user?.uid, visitorId]);

  const { data: measurements, isLoading } = useCollection<SiteMeasurement>(measurementsCollectionRef);

  const handleDeleteMeasurement = async (measurementId: string) => {
    if (!measurementsCollectionRef) return;
    const measurementDocRef = doc(measurementsCollectionRef, measurementId);
    try {
      await deleteDoc(measurementDocRef);
      toast({
        title: "Measurement Deleted",
        description: "The site measurement has been removed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Could not delete the measurement.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
      <Header title="Site Measurements" />
      <main className="flex-1 flex flex-col p-4 gap-4">
        {isLoading && (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="rounded-2xl">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && measurements && measurements.length > 0 && (
          <div className="space-y-4">
            {measurements.map((m) => (
              <Card key={m.id} className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle className="capitalize text-lg">{m.productType.replace('-', ' ')} - {m.roomType}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                    <p><strong>Width:</strong> {m.width}"</p>
                    <p><strong>Height:</strong> {m.height}"</p>
                    {m.depth && <p><strong>Depth:</strong> {m.depth}"</p>}
                    <p><strong>SqFt:</strong> {m.totalSqFt?.toFixed(2)}</p>
                </CardContent>
                <CardFooter className='justify-end'>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="text-destructive/80 hover:text-destructive">
                             <Trash2 className="h-5 w-5" />
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will permanently delete this measurement.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMeasurement(m.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {!isLoading && (!measurements || measurements.length === 0) && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg bg-background min-h-[200px]">
                <p className="text-lg font-semibold">No Measurements Taken</p>
                <p className="text-sm">Add a new measurement to get started.</p>
            </div>
        )}
      </main>
      <footer className="sticky bottom-0 p-4 bg-transparent backdrop-blur-sm">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full h-14 rounded-full text-lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Measurement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Site Measurement</DialogTitle>
            </DialogHeader>
            <MeasurementForm 
                visitorId={visitorId as string}
                onSave={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </footer>
      <BottomNav />
    </div>
  );
}
