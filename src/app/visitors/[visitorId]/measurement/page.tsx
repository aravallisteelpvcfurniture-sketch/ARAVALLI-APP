'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import type { SiteMeasurement } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MeasurementForm } from '@/components/measurement-form';
import { ChevronLeft, Bell, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function MeasurementPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const visitorId = params.visitorId as string;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const measurementsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return collection(firestore, 'users', user.uid, 'visitors', visitorId, 'measurements');
  }, [firestore, user?.uid, visitorId]);

  const { data: measurements, isLoading } = useCollection<SiteMeasurement>(measurementsCollectionRef);

  const handleMeasurementSaved = () => {
    setIsDialogOpen(false);
  };

  const handleDelete = async (measurementId: string) => {
    if (!measurementsCollectionRef) return;
    const docRef = doc(measurementsCollectionRef, measurementId);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-muted">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Site Measurement</h1>
        </div>
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </>
        ) : measurements && measurements.length > 0 ? (
          measurements.map((m) => (
            <Card key={m.id} className="rounded-2xl shadow-sm overflow-hidden">
              <CardContent className="p-3 flex gap-3">
                <div className="w-24 h-24 relative flex-shrink-0">
                  <Image
                    src={`https://picsum.photos/seed/${m.id}/200/200`}
                    alt={m.productType}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                    data-ai-hint="kitchen interior"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg uppercase">{m.productType.replace('-', ' ')}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{m.roomType}</p>
                  <p className="text-sm font-medium mt-1">
                    H : {m.height} <span className="text-muted-foreground">|</span> W : {m.width} <span className="text-muted-foreground">|</span> D : {m.depth || 'N/A'}
                  </p>
                  <p className="text-sm font-medium">
                    Total Inch : {m.totalInch} <span className="text-muted-foreground">|</span> Total SQFT : {m.totalSqFt.toFixed(2)}
                  </p>
                </div>
                <div className="flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48 border-2 border-dashed rounded-lg">
            <p className="font-semibold">No Measurements Found</p>
            <p className="text-sm">Click "Add More Product" to get started.</p>
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 bg-background p-4 border-t">
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="w-full h-12 text-lg border-dashed border-2 border-primary bg-background text-primary hover:bg-primary/10"
          variant="outline"
        >
          Add More Product
        </Button>
      </footer>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Enter the dimensions for the new product.
            </DialogDescription>
          </DialogHeader>
          <MeasurementForm
            visitorId={visitorId}
            onSave={handleMeasurementSaved}
            title="Add Product"
            buttonText="Add Now"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
