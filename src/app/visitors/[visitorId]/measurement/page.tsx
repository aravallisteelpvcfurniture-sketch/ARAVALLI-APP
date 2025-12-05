'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, ChevronLeft, Bell } from 'lucide-react';
import { MeasurementForm } from '@/components/measurement-form';
import { Skeleton } from '@/components/ui/skeleton';
import type { SiteMeasurement } from '@/lib/types';

export default function MeasurementPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const { visitorId } = params as { visitorId: string };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const measurementsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return collection(firestore, 'users', user.uid, 'visitors', visitorId, 'measurements');
  }, [firestore, user?.uid, visitorId]);

  const { data: measurements, isLoading } = useCollection<SiteMeasurement>(measurementsCollectionRef);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original string if invalid
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col min-h-dvh bg-gray-100 dark:bg-gray-800">
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


      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                         <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-8 w-20" />
                        </div>
                    </CardContent>
                </Card>
            ))}
          </div>
        ) : measurements && measurements.length > 0 ? (
          <div className="space-y-4">
            {measurements.sort((a, b) => (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any)).map((m) => (
              <Card key={m.id} className="overflow-hidden rounded-2xl shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className='space-y-1'>
                       <p className="text-base font-semibold">{m.productType} ({m.roomType})</p>
                       <p className="text-sm text-muted-foreground">{`W: ${m.width}" x H: ${m.height}"`}{m.depth ? ` x D: ${m.depth}'` : ''}</p>
                       <p className="text-sm font-medium text-primary">{m.totalSqFt.toFixed(2)} sqft</p>
                       <p className="text-xs text-muted-foreground">{formatDate(m.createdAt)}</p>
                    </div>
                    <Button variant="secondary" onClick={() => router.push(`/visitors/${visitorId}/quotation?measurementId=${m.id}&width=${m.width}&height=${m.height}`)}>
                      Create Quotation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <p className="font-semibold">No Products Added</p>
            <p className="text-sm">Click "Add More Product" to get started.</p>
          </div>
        )}
      </main>
        
      <footer className="p-4 bg-gray-100 dark:bg-gray-800">
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full border-2 border-dashed border-gray-400 bg-transparent text-gray-600 hover:bg-gray-200 hover:text-gray-700">Add More Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-gray-200 p-0">
                <DialogHeader className="p-4 bg-white rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <DialogTitle className="text-xl font-bold">Add Product</DialogTitle>
                    <DialogClose asChild>
                      <Button variant="ghost" size="icon"><X className="h-5 w-5"/></Button>
                    </DialogClose>
                  </div>
                </DialogHeader>
                <div className="p-4">
                  <MeasurementForm
                    visitorId={visitorId}
                    onSave={() => setIsDialogOpen(false)}
                    title="Add Product"
                    buttonText="Add Now"
                  />
                </div>
            </DialogContent>
          </Dialog>
      </footer>
    </div>
  );
}
