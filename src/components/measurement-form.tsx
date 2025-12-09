'use client';

import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking }from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const measurementSchema = z.object({
  productType: z.string().min(1, 'Product type is required.'),
  roomType: z.string().min(1, 'Room type is required.'),
  width: z.coerce.number().min(1, 'Width is required'),
  height: z.coerce.number().min(1, 'Height is required'),
});

interface MeasurementFormProps {
  visitorId: string;
  onSave: () => void;
  title: string;
  buttonText: string;
}

export function MeasurementForm({ visitorId, onSave, title, buttonText }: MeasurementFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [totalSqFt, setTotalSqFt] = useState(0);
  const [totalInch, setTotalInch] = useState(0);

  const measurementsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return collection(firestore, 'users', user.uid, 'visitors', visitorId, 'measurements');
  }, [firestore, user?.uid, visitorId]);

  const form = useForm<z.infer<typeof measurementSchema>>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      productType: '',
      roomType: '',
    },
  });
  
  const watchedValues = form.watch();

  useEffect(() => {
    const { width, height } = watchedValues;
    const w = width || 0;
    const h = height || 0;
    const sqft = (w * h) / 144;
    const inch = w * h;
    setTotalSqFt(sqft);
    setTotalInch(inch);
  }, [watchedValues]);


  const onSubmit = async (values: z.infer<typeof measurementSchema>) => {
    if (!measurementsCollectionRef) return;

    setIsSaving(true);
    
    const measurementData: any = {
      ...values,
      totalSqFt,
      totalInch,
      createdAt: new Date().toISOString(),
    };

    try {
        await addDocumentNonBlocking(measurementsCollectionRef, measurementData);

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
            control={form.control}
            name="productType"
            render={({ field }) => (
                <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="h-12 rounded-full bg-white border-gray-300">
                                <SelectValue placeholder="MODULAR KITCHEN" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="modular-kitchen">Modular Kitchen</SelectItem>
                            <SelectItem value="wardrobe">Wardrobe</SelectItem>
                            <SelectItem value="tv-unit">TV Unit</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="roomType"
            render={({ field }) => (
                <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="h-12 rounded-full bg-white border-gray-300">
                                <SelectValue placeholder="room" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="kitchen">Kitchen</SelectItem>
                            <SelectItem value="bedroom">Bedroom</SelectItem>
                            <SelectItem value="living-room">Living Room</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
        
        <div>
          <div className="grid grid-cols-2 gap-2">
            <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Width (Inch)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} value={field.value ?? ''} className="h-12 rounded-lg bg-white border-gray-300 text-center" />
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
                    <FormLabel>Height (Inch)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} value={field.value ?? ''} className="h-12 rounded-lg bg-white border-gray-300 text-center" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
        </div>
        
        <div className="relative">
            <Input 
                value={`Total sqft : ${totalSqFt.toFixed(2)}`} 
                readOnly 
                className="h-12 rounded-full bg-white border-gray-300 font-medium text-center"
            />
        </div>
         <div className="relative">
            <Input 
                value={`Total Inch : ${totalInch.toFixed(2)}`} 
                readOnly 
                className="h-12 rounded-full bg-white border-gray-300 font-medium text-center"
            />
        </div>
        
        <Button type="submit" size="lg" className="w-full h-12 rounded-full text-lg bg-green-500 hover:bg-green-600" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText}
        </Button>
      </form>
    </Form>
  );
}
