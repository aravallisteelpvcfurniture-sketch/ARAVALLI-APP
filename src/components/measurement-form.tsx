'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, MoveHorizontal, MoveVertical } from 'lucide-react';

const measurementSchema = z.object({
  width: z.coerce.number().min(0.1, 'Width must be greater than 0'),
  height: z.coerce.number().min(0.1, 'Height must be greater than 0'),
});

interface MeasurementFormProps {
  visitorId: string;
  onSave: () => void;
}

export function MeasurementForm({ visitorId, onSave }: MeasurementFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);

  const measurementsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return collection(firestore, 'users', user.uid, 'visitors', visitorId, 'measurements');
  }, [firestore, user?.uid, visitorId]);

  const form = useForm<z.infer<typeof measurementSchema>>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      width: 0,
      height: 0,
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setPhotoData(result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadPhoto = async (measurementId: string): Promise<string | null> => {
    if (!photoData || !user?.uid || !visitorId) return null;
    
    const storage = getStorage();
    const photoRef = ref(storage, `users/${user.uid}/visitors/${visitorId}/${measurementId}.jpg`);

    try {
        await uploadString(photoRef, photoData, 'data_url');
        const downloadURL = await getDownloadURL(photoRef);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading photo: ", error);
        toast({
            variant: "destructive",
            title: "Photo Upload Failed",
            description: "Could not upload the measurement photo.",
        });
        return null;
    }
  }


  const onSubmit = async (values: z.infer<typeof measurementSchema>) => {
    if (!measurementsCollectionRef) return;

    setIsSaving(true);
    const totalSqFt = values.width * values.height;
    
    const measurementData: any = {
      width: values.width,
      height: values.height,
      totalSqFt: totalSqFt,
      createdAt: new Date().toISOString(), // Use ISO string for consistency
    };

    try {
        const newDocRef = await addDocumentNonBlocking(measurementsCollectionRef, measurementData);
        
        if (photoData && newDocRef) {
            const photoUrl = await uploadPhoto(newDocRef.id);
            if (photoUrl) {
                // This is a fire-and-forget update, consistent with non-blocking pattern
                 addDocumentNonBlocking(measurementsCollectionRef, { photo: photoUrl }, newDocRef);
            }
        }

        toast({
            title: 'Measurement Saved',
            description: 'The new site measurement has been added.',
        });
        onSave();
    } catch (e) {
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "Could not save the measurement.",
        });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width (ft)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MoveHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="number" placeholder="e.g. 10.5" {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (ft)</FormLabel>
                <FormControl>
                    <div className="relative">
                        <MoveVertical className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input type="number" placeholder="e.g. 8" {...field} className="pl-10"/>
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormItem>
            <FormLabel>Measurement Photo</FormLabel>
            <FormControl>
                 <label htmlFor="photo-upload" className="mt-2 flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary">
                    <div className="space-y-1 text-center">
                        {photoPreview ? (
                             <img src={photoPreview} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />
                        ) : (
                            <>
                                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Click to upload a photo
                                </p>
                             </>
                        )}
                    </div>
                    <input id="photo-upload" name="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                </label>
            </FormControl>
        </FormItem>
        

        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Measurement
        </Button>
      </form>
    </Form>
  </change>
  <change>
    <file>src/lib/types.ts</file>
    <content><![CDATA[import type { EstimateFurnitureCostOutput } from "@/ai/flows/real-time-cost-estimation";
import type { SuggestDesignImprovementsOutput } from "@/ai/flows/design-improvement-suggestions";
import type { LucideIcon } from 'lucide-react';

export type FurnitureConfig = {
  material: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  features: string[];
  finalPrice?: number;
};

export type Cost = EstimateFurnitureCostOutput;
export type Suggestions = SuggestDesignImprovementsOutput;

export type MaterialOption = {
  id: string;
  name: string;
};

export type FeatureOption = {
  id: string;
  name: string;
  icon: LucideIcon;
};

export type QuotationData = {
    id: string;
    userId: string;
    visitorId: string;
    material: string;
    length: number;
    width: number;
    height: number;
    features: string[];
    estimatedCost: number;
    finalPrice: number;
    configurationDate: string;
  };

export type SiteMeasurement = {
    id: string;
    width: number;
    height: number;
    totalSqFt: number;
    photo?: string;
    createdAt: string;
};
