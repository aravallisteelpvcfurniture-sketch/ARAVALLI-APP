'use client';

import React, { useState, useMemo } from 'react';
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
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Image as ImageIcon, ExternalLink } from 'lucide-react';
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

  return (
    <div className="flex flex-col min-h-dvh bg-muted">
      <Header title="Site Measurements" />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Saved Measurements</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Take New Measurement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Measurement</DialogTitle>
                <DialogDescription>
                  Enter the dimensions and upload a photo for the new site measurement.
                </DialogDescription>
              </DialogHeader>
              <MeasurementForm
                visitorId={visitorId}
                onSave={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                         <div className="flex gap-4">
                            <Skeleton className="h-24 w-24 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-8 w-full mt-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
          </div>
        ) : measurements && measurements.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {measurements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((m) => (
              <Card key={m.id} className="overflow-hidden rounded-2xl shadow-sm">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                       {m.photo ? (
                         <Image
                           src={m.photo}
                           alt={`Measurement ${m.id}`}
                           width={96}
                           height={96}
                           className="object-cover w-full h-full"
                         />
                       ) : (
                         <ImageIcon className="h-8 w-8 text-muted-foreground" />
                       )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-primary">{`W: ${m.width} ft x H: ${m.height} ft`}</p>
                      <p className="text-lg font-bold">{m.totalSqFt.toFixed(2)} sq. ft.</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(m.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                       <Button
                        variant="secondary"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => router.push(`/visitors/${visitorId}/quotation?width=${m.width}&height=${m.height}`)}
                       >
                         Create Quotation
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64 border-2 border-dashed rounded-lg">
            <p className="font-semibold">No Measurements Found</p>
            <p className="text-sm">Click "Take New Measurement" to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
}
