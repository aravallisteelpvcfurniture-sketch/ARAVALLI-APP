'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import type { SiteMeasurement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { MeasurementForm } from '@/components/measurement-form';
import { ChevronLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MeasurementPage() {
  const router = useRouter();
  const params = useParams();
  const { visitorId } = params as { visitorId: string };
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const measurementsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return collection(firestore, 'users', user.uid, 'visitors', visitorId, 'measurements');
  }, [firestore, user?.uid, visitorId]);

  const { data: measurements, isLoading: isMeasurementsLoading } = useCollection<SiteMeasurement>(measurementsCollectionRef);

  const handleDelete = async (measurementId: string) => {
    if (!measurementsCollectionRef) return;
    const measurementDocRef = doc(measurementsCollectionRef, measurementId);
    await deleteDoc(measurementDocRef);
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="flex flex-col min-h-dvh bg-muted text-foreground">
        <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Site Measurement</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {isMeasurementsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-36 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
              <Skeleton className="h-36 w-full rounded-2xl" />
            </div>
          ) : measurements && measurements.length > 0 ? (
            measurements.map((m) => (
              <Card key={m.id} className="bg-card rounded-2xl shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg capitalize">{m.productType?.replace('-', ' ')} - {m.roomType} </CardTitle>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70" onClick={() => handleDelete(m.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <p className="text-muted-foreground">Dimensions (H×W×D)</p>
                  <p className="font-mono text-right">{m.height} x {m.width} {m.depth ? `x ${m.depth}` : ''} inch</p>
                  
                  <p className="text-muted-foreground">Total Inch</p>
                  <p className="font-mono text-right">{m.totalInch.toFixed(2)}</p>

                  <p className="text-muted-foreground">Total SqFt</p>
                  <p className="font-mono text-right">{m.totalSqFt.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p className="font-semibold">No Measurements Yet</p>
                <p className="text-sm">Click the button below to add the first measurement.</p>
            </div>
          )}
        </main>
        
        <footer className="sticky bottom-0 p-4 bg-muted border-t">
            <DialogTrigger asChild>
                <Button size="lg" className="w-full h-12 rounded-full text-lg shadow-lg">
                    <Plus className="mr-2 h-5 w-5"/>
                    Add More Product
                </Button>
            </DialogTrigger>
        </footer>

        <DialogContent className="max-w-md mx-auto m-0 rounded-t-3xl">
          <DialogHeader className="pt-4">
            <DialogTitle className="text-center text-xl">Add Product</DialogTitle>
          </DialogHeader>
          <MeasurementForm 
            visitorId={visitorId} 
            onSave={() => setIsDialogOpen(false)}
            title="Add Product"
            buttonText="Save Measurement"
          />
        </DialogContent>
      </div>
    </Dialog>
  );
}
