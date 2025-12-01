'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ChevronLeft, Bell, Camera, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase, useCollection, useDoc } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const measurementSchema = z.object({
  length: z.string().min(1, 'Length is required'),
  width: z.string().min(1, 'Width is required'),
  height: z.string().min(1, 'Height is required'),
});

type MeasurementFormData = z.infer<typeof measurementSchema>;

export default function MeasurementPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const firestore = useFirestore();

  const { visitorId } = params as { visitorId: string };

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const visitorDocRef = useMemoFirebase(() => {
    if (!firestore || !user || !visitorId) return null;
    return doc(firestore, 'users', user.uid, 'visitors', visitorId);
  }, [firestore, user, visitorId]);

  const measurementsCollectionRef = useMemoFirebase(() => {
    if (!visitorDocRef) return null;
    return collection(visitorDocRef, 'measurements');
  }, [visitorDocRef]);

  const { data: visitorData, isLoading: isVisitorLoading } = useDoc(visitorDocRef);
  const { data: measurements, isLoading: areMeasurementsLoading } = useCollection(measurementsCollectionRef);

  const form = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      length: '',
      width: '',
      height: '',
    },
  });
  
  useEffect(() => {
    if (isCameraOpen) {
      const getCameraPermission = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error('Camera API is not supported in this browser.');
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Not Supported',
            description: 'Your browser does not support camera access.',
          });
          return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
  
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      };
      getCameraPermission();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraOpen, toast]);

  const handleTakePhoto = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setPhoto(dataUrl);
            setIsCameraOpen(false);
        }
      }
  };


  const onSubmit = (values: MeasurementFormData) => {
    if (!measurementsCollectionRef) return;

    addDocumentNonBlocking(measurementsCollectionRef, { 
        ...values,
        photo,
        createdAt: new Date().toISOString(),
     });

    toast({
      title: 'Measurement Saved',
      description: `The new site measurement has been saved for ${visitorData?.name || 'this visitor'}.`,
    });
    form.reset();
    setPhoto(null);
  };

  const isLoading = form.formState.isSubmitting;

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
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {photo ? (
                        <div className="relative w-full aspect-video">
                            <Image src={photo} alt="Site measurement" layout="fill" className="rounded-md object-cover" />
                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full h-8 w-8" onClick={() => setPhoto(null)}>
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    ) : isCameraOpen ? (
                        <div className="space-y-2">
                           <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted playsInline />
                           <Button className="w-full" onClick={handleTakePhoto}>
                               <Camera className="mr-2"/> Capture
                           </Button>
                        </div>
                    ) : (
                        <Button variant="outline" className="w-full h-32 border-dashed" onClick={() => setIsCameraOpen(true)}>
                            <Camera className="mr-2"/> Take Photo
                        </Button>
                    )}

                    <canvas ref={canvasRef} className="hidden" />

                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <FormField control={form.control} name="length" render={({ field }) => (
                                <FormItem><FormLabel>Length</FormLabel><FormControl><Input placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="width" render={({ field }) => (
                                <FormItem><FormLabel>Width</FormLabel><FormControl><Input placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="height" render={({ field }) => (
                                <FormItem><FormLabel>Height</FormLabel><FormControl><Input placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <Button type="submit" size="lg" className="w-full" disabled={isLoading || !photo}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save
                        </Button>
                    </form>
                    </Form>
                </div>
            </CardContent>
        </Card>

        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle>Last saved records</CardTitle>
            </CardHeader>
            <CardContent>
                {areMeasurementsLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : measurements && measurements.length > 0 ? (
                    <div className="space-y-2">
                       {measurements.map(m => (
                         <div key={m.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="text-sm">
                                <span className="font-semibold">L:</span> {m.length} &nbsp;
                                <span className="font-semibold">W:</span> {m.width} &nbsp;
                                <span className="font-semibold">H:</span> {m.height}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {new Date(m.createdAt).toLocaleDateString()}
                            </div>
                         </div>
                       ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No records found.</p>
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
