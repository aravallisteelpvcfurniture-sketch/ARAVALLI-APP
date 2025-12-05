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
import { collection, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const measurementSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  height: z.coerce.number().min(0.1, 'Height must be greater than 0'),
  width: z.coerce.number().min(0.1, 'Width must be greater than 0'),
  depth: z.coerce.number().min(0).optional(),
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
  const [totalSqFt, setTotalSqFt] = useState(0);

  const measurementsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return collection(firestore, 'users', user.uid, 'visitors', visitorId, 'measurements');
  }, [firestore, user?.uid, visitorId]);

  const form = useForm<z.infer<typeof measurementSchema>>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      title: '',
      height: 0,
      width: 0,
      depth: 0,
    },
  });
  
  const watchedValues = form.watch();

  useEffect(() => {
    const { height, width } = watchedValues;
    const sqft = (height || 0) * (width || 0);
    setTotalSqFt(sqft);
  }, [watchedValues]);


  const onSubmit = async (values: z.infer<typeof measurementSchema>) => {
    if (!measurementsCollectionRef) return;

    setIsSaving(true);
    
    const newDocRef = doc(measurementsCollectionRef);

    const measurementData: any = {
      ...values,
      depth: values.depth || 0,
      totalSqFt,
      createdAt: new Date().toISOString(),
    };

    try {
        await addDocumentNonBlocking(measurementsCollectionRef, measurementData, newDocRef);

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
            name="title"
            render={({ field }) => (
                <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="h-12 rounded-full bg-white border-gray-300">
                                <SelectValue placeholder="Select Product" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="wardrobe">Wardrobe</SelectItem>
                            <SelectItem value="tv-unit">TV Unit</SelectItem>
                            <SelectItem value="kitchen">Kitchen</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
        
        <div>
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Measurement in Feet</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input type="number" placeholder="Height" {...field} className="h-12 rounded-lg bg-white border-gray-300 text-center" />
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
                        <Input type="number" placeholder="Width" {...field} className="h-12 rounded-lg bg-white border-gray-300 text-center" />
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
                        <Input type="number" placeholder="Depth" {...field} className="h-12 rounded-lg bg-white border-gray-300 text-center" />
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
        
        <Button type="submit" size="lg" className="w-full h-12 rounded-full text-lg" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Now
        </Button>
      </form>
    </Form>
  );
}
