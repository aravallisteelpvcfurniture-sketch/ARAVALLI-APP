'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2, ArrowLeft, Bell } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


export default function QuotationPage() {
  const { visitorId } = useParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const [showRate, setShowRate] = useState('yes');
  const [showDimension, setShowDimension] = useState('yes');

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

  const totalPrice = useMemo(() => {
    if (!measurements) return 0;
    return measurements.reduce((acc, m) => acc + (m.totalPrice || 0), 0);
  }, [measurements]);

  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
        <header className="sticky top-0 z-30 bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className='flex items-center gap-4'>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">Quotation</h1>
            </div>
            <Bell className="h-6 w-6" />
        </header>

      <main className="flex-1 flex flex-col p-4 gap-4 mb-40">
        <div className='grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2'>
            <label className='text-sm font-medium'>Show Rate :</label>
            <ToggleGroup type="single" value={showRate} onValueChange={(value) => value && setShowRate(value)} className='justify-start'>
                <ToggleGroupItem value="yes" className='h-8 px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'>Yes</ToggleGroupItem>
                <ToggleGroupItem value="no" className='h-8 px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'>No</ToggleGroupItem>
            </ToggleGroup>

            <label className='text-sm font-medium'>Show Dimension :</label>
             <div className='flex items-center justify-between'>
                <ToggleGroup type="single" value={showDimension} onValueChange={(value) => value && setShowDimension(value)} className='justify-start'>
                    <ToggleGroupItem value="yes" className='h-8 px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'>Yes</ToggleGroupItem>
                    <ToggleGroupItem value="no" className='h-8 px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'>No</ToggleGroupItem>
                </ToggleGroup>
                 <Button variant="link" className='p-0 h-auto text-primary'>Edit Mobile Number</Button>
            </div>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-4 flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className='flex-1 space-y-2'>
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && measurements && measurements.length > 0 && (
          <div className="space-y-3">
            {measurements.map((m) => (
              <Card key={m.id} className="rounded-xl shadow-md bg-card">
                 <CardContent className="p-3 flex items-center gap-3">
                    <Image 
                        src="https://picsum.photos/seed/kitchen/200/200" 
                        alt={m.productType}
                        width={64}
                        height={64}
                        className='rounded-md aspect-square object-cover'
                    />
                    <div className='flex-1'>
                        <h4 className='font-bold uppercase'>{m.productType.replace('-', ' ')}</h4>
                        <p className='text-sm text-muted-foreground'>{m.title || 'Room'}</p>
                         <p className='text-sm font-mono'>
                            {m.quantity ? (
                                <>
                                    {showDimension === 'yes' && <span>{m.quantity}qty</span>}
                                    {showRate === 'yes' && <span> x ₹{m.pricePerQuantity?.toFixed(2)} = ₹{m.totalPrice?.toFixed(2)}</span>}
                                </>
                            ) : (
                                <>
                                    {showDimension === 'yes' && <span>{m.totalSqFt?.toFixed(2)} sqft</span>}
                                    {showRate === 'yes' && <span> @ ₹{((m.totalPrice || 0) / (m.totalSqFt || 1)).toFixed(2)} = ₹{m.totalPrice?.toFixed(2)}</span>}
                                </>
                            )}
                        </p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive/70 hover:text-destructive hover:bg-destructive/10">
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
                 </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!isLoading && (!measurements || measurements.length === 0) && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg bg-background min-h-[200px]">
                <p className="text-lg font-semibold">No Products in Quotation</p>
                <p className="text-sm">Add a new product to get started.</p>
            </div>
        )}

      </main>
      <footer className="fixed bottom-0 left-0 w-full p-4 bg-background border-t-2 shadow-inner z-20">
        <div className='space-y-3'>
            <div className='flex items-center justify-between p-3 border rounded-lg bg-card'>
                <span className='text-lg font-bold'>Total Price</span>
                <span className='text-2xl font-bold'>₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} /-</span>
            </div>
            <div className='grid grid-cols-2 gap-3'>
                 <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button variant='outline' size="lg" className="h-12 text-base border-dashed border-2 font-semibold">
                            Add More Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Add Product</DialogTitle>
                        </DialogHeader>
                        <MeasurementForm 
                            visitorId={visitorId as string}
                            onSave={() => setIsFormOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
                <Button variant='outline' size="lg" className="h-12 text-base border-dashed border-2 font-semibold" disabled>Add Payment Plan</Button>
            </div>
            <div className='grid grid-cols-2 gap-3'>
                <Button size="lg" className="w-full h-12 text-lg font-bold" disabled>Share Estimate</Button>
                <Button variant='outline' size="lg" className="w-full h-12 text-lg font-bold text-primary border-primary" disabled>Move To Carpenter</Button>
            </div>
        </div>
      </footer>
    </div>
  );
}
