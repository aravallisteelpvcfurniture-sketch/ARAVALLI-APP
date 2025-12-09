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
  title: z.string().optional(),
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

export function MeasurementForm({ visitorId, onSave, title: formTitle, buttonText }: MeasurementFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [totalSqFt, setTotalSqFt] = useState(0);

  const measurementsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return collection(firestore, 'users', user.uid, 'visitors', visitorId, 'measurements');
  }, [firestore, user?.uid, visitorId]);

  const form = useForm<z.infer<typeof measurementSchema>>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      title: '',
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
    setTotalSqFt(sqft);
  }, [watchedValues]);


  const onSubmit = async (values: z.infer<typeof measurementSchema>) => {
    if (!measurementsCollectionRef) return;

    setIsSaving(true);
    
    const totalInch = (values.width || 0) * (values.height || 0);

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
        form.reset();
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
        <FormField
            control={form.control}
            name="productType"
            render={({ field }) => (
                <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="h-12 rounded-lg bg-muted border-gray-300">
                                <SelectValue placeholder="Select Product" />
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
            name="title"
            render={({ field }) => (
            <FormItem>
                <FormControl>
                    <Input placeholder="Title" {...field} className="h-12 rounded-lg bg-muted border-gray-300"/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <div>
          <FormLabel>Measurement in Inch</FormLabel>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input type="number" placeholder="Height" {...field} value={field.value ?? ''} className="h-12 rounded-lg bg-muted border-gray-300 text-center" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input type="number" placeholder="Width" {...field} value={field.value ?? ''} className="h-12 rounded-lg bg-muted border-gray-300 text-center" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
        </div>
        
        <div className="relative">
             <FormLabel className="sr-only">Total SqFt</FormLabel>
            <Input 
                value={`Total sqft : ${totalSqFt.toFixed(2)}`} 
                readOnly 
                className="h-12 rounded-lg bg-muted border-gray-300 font-medium"
            />
        </div>
        
        <Button type="submit" size="lg" className="w-full h-14 rounded-full text-lg bg-green-500 hover:bg-green-600" disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Now"}
        </Button>
      </form>
    </Form>
  );
}
