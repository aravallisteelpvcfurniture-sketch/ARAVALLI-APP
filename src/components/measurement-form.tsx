'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking }from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const measurementSchema = z.object({
  productType: z.string().min(1, 'Product type is required.'),
  roomType: z.string().min(1, 'Room type is required.'),
  width: z.coerce.number().min(1, 'Width is required.'),
  height: z.coerce.number().min(1, 'Height is required.'),
  depth: z.coerce.number().optional(),
});


interface MeasurementFormProps {
  visitorId: string;
  onSave: () => void;
  title?: string;
  buttonText?: string;
}

export function MeasurementForm({ visitorId, onSave, title: formTitle, buttonText }: MeasurementFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<z.infer<typeof measurementSchema>>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      productType: '',
      roomType: '',
      width: undefined,
      height: undefined,
      depth: undefined,
    },
  });

  const measurementsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return collection(firestore, 'users', user.uid, 'visitors', visitorId, 'measurements');
  }, [firestore, user?.uid, visitorId]);

  const onSubmit = async (values: z.infer<typeof measurementSchema>) => {
    if (!measurementsCollectionRef) return;

    setIsSaving(true);
    
    const measurementData = {
        ...values,
        totalSqFt: (values.width * values.height) / 144,
        totalInch: values.width * values.height,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Product Type" />
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
               <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Room Type" />
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
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Width (in)" {...field} type="number" className="h-12 text-base" />
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
                <FormControl>
                  <Input placeholder="Height (in)" {...field} type="number" className="h-12 text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="depth"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Depth (in)" {...field} type="number" className="h-12 text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size="lg" className="w-full h-14" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText || 'Add Measurement'}
        </Button>
      </form>
    </Form>
  );
}
