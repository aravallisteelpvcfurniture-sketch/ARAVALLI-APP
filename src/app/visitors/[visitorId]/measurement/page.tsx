'use client';

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ChevronLeft, Bell, MoveHorizontal, MoveVertical, Square, Camera, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';


export default function MeasurementPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const { visitorId } = params as { visitorId: string };

  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [totalSqFt, setTotalSqFt] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const measurementsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'visitors', visitorId, 'measurements');
  }, [firestore, user?.uid, visitorId]);

  const { data: measurements, isLoading: areMeasurementsLoading } = useCollection(measurementsCollectionRef);

  useEffect(() => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      setTotalSqFt(w * h);
    } else {
      setTotalSqFt(0);
    }
  }, [width, height]);
  
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setPhoto(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!measurementsCollectionRef || totalSqFt <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter valid width and height.",
      });
      return;
    }
    
    setIsSaving(true);
    
    let photoUrl = '';
    if (photo) {
        try {
            const storage = getStorage();
            // Create a unique path for the image
            const imageRef = ref(storage, `measurements/${visitorId}/${Date.now()}`);
            // The photo state is a data URL, we need to upload the base64 part
            const uploadResult = await uploadString(imageRef, photo, 'data_url');
            photoUrl = await getDownloadURL(uploadResult.ref);
        } catch (error) {
            console.error("Error uploading image: ", error);
            toast({
                variant: "destructive",
                title: "Image Upload Failed",
                description: "Could not upload the site photo. Measurement saved without photo.",
            });
        }
    }


    const measurementData = {
      width: parseFloat(width),
      height: parseFloat(height),
      totalSqFt,
      photo: photoUrl,
      createdAt: serverTimestamp(),
    };

    try {
      await addDocumentNonBlocking(measurementsCollectionRef, measurementData);
      toast({
        title: "Measurement Saved",
        description: `Measurement of ${totalSqFt.toFixed(2)} sq. ft. has been saved.`,
      });
      // Reset form
      setWidth('');
      setHeight('');
      setPhoto(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "There was a problem saving the measurement.",
        });
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleDelete = (measurementId: string) => {
    if (!firestore || !user?.uid) return;
    const docRef = collection(firestore, 'users', user.uid, 'visitors', visitorId, 'measurements');
    deleteDocumentNonBlocking(doc(docRef, measurementId));
    toast({
        title: "Measurement Deleted",
        description: "The measurement has been removed.",
    });
  }

  const createQuotation = (measurement: { width: number, height: number }) => {
    router.push(`/visitors/${visitorId}/quotation?width=${measurement.width}&height=${measurement.height}`);
  }

  return (
    <div className="flex flex-col min-h-dvh bg-muted text-foreground">
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
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle>Capture Measurement</CardTitle>
                <CardDescription>Enter dimensions in feet. Total square footage will be calculated automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="width">Width (ft)</Label>
                        <div className="relative">
                            <MoveHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="width" type="number" placeholder="e.g., 10.5" value={width} onChange={(e) => setWidth(e.target.value)} className="pl-10"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">Height (ft)</Label>
                         <div className="relative">
                            <MoveVertical className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="height" type="number" placeholder="e.g., 8" value={height} onChange={(e) => setHeight(e.target.value)} className="pl-10"/>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label>Calculated Area</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md border">
                        <Square className="h-5 w-5 text-primary"/>
                        <span className="font-semibold text-lg">{totalSqFt.toFixed(2)} sq. ft.</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="photo">Site Photo (Optional)</Label>
                     <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                           <Camera className="mr-2 h-4 w-4" /> Upload Photo
                        </Button>
                        <Input ref={fileInputRef} id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden"/>
                        {photo && <Image src={photo} alt="Site preview" width={64} height={64} className="rounded-md object-cover aspect-square" />}
                    </div>
                </div>

                <Button onClick={handleSave} disabled={isSaving || totalSqFt <= 0} className="w-full">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Save Measurement
                </Button>
            </CardContent>
        </Card>

        <div className="space-y-4">
            <h2 className="text-xl font-bold">Saved Measurements</h2>
            {areMeasurementsLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            ) : measurements && measurements.length > 0 ? (
                 <div className="grid gap-4">
                    {measurements.map((m) => (
                        <Card key={m.id} className="rounded-xl">
                            <CardContent className="p-4 flex items-center justify-between gap-4">
                               <div className="flex items-center gap-4">
                                    {m.photo ? (
                                        <Image src={m.photo} alt="Site" width={56} height={56} className="rounded-md object-cover aspect-square bg-muted"/>
                                    ) : (
                                        <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center">
                                            <Square className="h-6 w-6 text-muted-foreground"/>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold">{m.width} ft x {m.height} ft</p>
                                        <p className="text-sm text-primary font-bold">{m.totalSqFt.toFixed(2)} sq. ft.</p>
                                        <p className="text-xs text-muted-foreground">
                                           {m.createdAt?.toDate().toLocaleDateString()}
                                        </p>
                                    </div>
                               </div>
                               <div className="flex flex-col gap-2">
                                     <Button size="sm" onClick={() => createQuotation(m)}>Create Quotation</Button>
                                     <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(m.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                     </Button>
                               </div>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            ) : (
                <div className="text-center text-muted-foreground py-10">
                    <p>No measurements saved for this visitor yet.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
