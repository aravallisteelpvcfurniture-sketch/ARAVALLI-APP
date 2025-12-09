'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
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

  const handleDeleteMeasurement = (measurementId: string) => {
    if (!measurementsCollectionRef) return;
    const measurementDocRef = doc(measurementsCollectionRef, measurementId);
    
    deleteDocumentNonBlocking(measurementDocRef);

    toast({
      title: "Measurement Deleted",
      description: "The site measurement has been removed.",
    });
  };

  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
      <Header title="Site Measurements" />
      <main className="flex-1 flex flex-col p-4 gap-4">
        {isLoading && (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && measurements && measurements.length > 0 && (
          <div className="space-y-4">
            {measurements.map((m) => (
              <Card key={m.id} className="relative">
                <CardHeader>
                    <CardTitle className="capitalize">{m.title || m.productType.replace('-', ' ')}</CardTitle>
                    <CardDescription className="capitalize">Room: {m.roomType} | Type: {m.productType.replace('-', ' ')}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                    <p><strong>Dimensions (WxH):</strong> {m.width}" x {m.height}"</p>
                    <p><strong>Total Inch:</strong> {m.totalInch ? m.totalInch.toFixed(2) : 'N/A'} in²</p>
                    <p><strong>Total SqFt:</strong> {m.totalSqFt ? m.totalSqFt.toFixed(2) : 'N/A'} ft²</p>
                </CardContent>
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
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {!isLoading && (!measurements || measurements.length === 0) && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg bg-background">
                <p className="text-lg font-semibold">No Measurements Recorded</p>
                <p className="text-sm">Add a new measurement to get started.</p>
            </div>
        )}

      </main>
      <footer className="sticky bottom-16 w-full p-4 bg-transparent">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full h-14 rounded-full text-lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add More Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Measurement</DialogTitle>
            </DialogHeader>
            <MeasurementForm 
                visitorId={visitorId as string}
                onSave={() => setIsFormOpen(false)}
                title="Save Measurement"
                buttonText="Add Measurement"
            />
          </DialogContent>
        </Dialog>
      </footer>
      <BottomNav />
    </div>
  );
}

    