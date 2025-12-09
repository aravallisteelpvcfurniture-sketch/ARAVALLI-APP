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
import { useUser, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, X, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import type { SiteMeasurement } from '@/lib/types';

const measurementBaseSchema = z.object({
  title: z.string().optional(),
  productType: z.string().min(1, 'Product type is required.'),
  width: z.coerce.number().optional().nullable(),
  height: z.coerce.number().optional().nullable(),
  depth: z.coerce.number().optional().nullable(),
  quantity: z.coerce.number().optional().nullable(),
  pricePerQuantity: z.coerce.number().optional().nullable(),
  pricePerSqFt: z.coerce.number().optional().nullable(),
});

const measurementSchema = measurementBaseSchema.superRefine((data, ctx) => {
  const isQuantityProduct = ['baskets', 'drawers'].includes(data.productType);
  if (isQuantityProduct) {
    if (!data.quantity || data.quantity < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['quantity'],
        message: 'Quantity is required',
      });
    }
    if (!data.pricePerQuantity || data.pricePerQuantity < 0) { // allow 0
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pricePerQuantity'],
        message: 'Price is required',
      });
    }
  } else {
    if (!data.width || data.width < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['width'],
        message: 'Width is required',
      });
    }
    if (!data.height || data.height < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['height'],
        message: 'Height is required',
      });
    }
  }
});

interface UpdateMeasurementFormProps {
  visitorId: string;
  measurement: SiteMeasurement;
  onSave: () => void;
}

const productTypes = [
    { value: 'modular-kitchen', label: 'MODULAR KITCHEN' },
    { value: 'wardrobe', label: 'WARDROBE' },
    { value: 'tv-unit', label: 'TV UNIT' },
    { value: 'baskets', label: 'BASKETS' },
    { value: 'self-partition', label: 'SELF/PARTITION' },
    { value: 'crockery', label: 'CROCKERY' },
    { value: 'framing', label: 'FRAMING' },
    { value: 'box', label: 'BOX' },
    { value: 'drawers', label: 'DRAWERS' },
];

export function UpdateMeasurementForm({ visitorId, measurement, onSave }: UpdateMeasurementFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const form = useForm<z.infer<typeof measurementSchema>>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      ...measurement,
      width: measurement.width ?? null,
      height: measurement.height ?? null,
      depth: measurement.depth ?? null,
      quantity: measurement.quantity ?? null,
      pricePerQuantity: measurement.pricePerQuantity ?? null,
      pricePerSqFt: measurement.pricePerSqFt ?? null,
    },
  });
  
  const watchedProductType = form.watch('productType');
  const watchedValues = form.watch();
  const [totalSqFt, setTotalSqFt] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const { width, height, pricePerSqFt, quantity, pricePerQuantity } = watchedValues;
    const isQuantityProduct = ['baskets', 'drawers'].includes(watchedProductType);

    if (isQuantityProduct) {
        setTotalPrice((quantity || 0) * (pricePerQuantity || 0));
    } else {
        const sqFt = (width && height) ? Math.round((width * height) / 144 * 100) / 100 : 0;
        setTotalSqFt(sqFt);
        setTotalPrice(sqFt * (pricePerSqFt || 0));
    }
  }, [watchedValues, watchedProductType]);

  const measurementDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return doc(firestore, 'users', user.uid, 'visitors', visitorId, 'measurements', measurement.id);
  }, [firestore, user?.uid, visitorId, measurement.id]);

  const onSubmit = async (values: z.infer<typeof measurementSchema>) => {
    if (!measurementDocRef) return;

    setIsSaving(true);
    
    let measurementData: Partial<SiteMeasurement> = {};
    const isQuantityProduct = ['baskets', 'drawers'].includes(values.productType);

    if (isQuantityProduct) {
      measurementData = {
        ...values,
        totalPrice: (values.quantity || 0) * (values.pricePerQuantity || 0),
        width: null,
        height: null,
        depth: null,
        totalSqFt: null,
        pricePerSqFt: null,
      };
    } else {
      const sqFt = (values.width && values.height) ? (values.width * values.height) / 144 : 0;
      measurementData = {
        ...values,
        totalSqFt: sqFt,
        totalPrice: sqFt * (values.pricePerSqFt || 0),
        quantity: null,
        pricePerQuantity: null,
      };
    }

    try {
        await updateDocumentNonBlocking(measurementDocRef, measurementData);
        toast({
            title: 'Measurement Updated',
            description: 'The measurement has been successfully updated.',
        });
        onSave();
    } catch (e) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update the measurement.",
        });
    } finally {
        setIsSaving(false);
    }
  };
  
  const filteredProducts = productTypes.filter(p => p.label.toLowerCase().includes(searchTerm.toLowerCase()));
  const formType = ['baskets', 'drawers'].includes(watchedProductType) ? 'quantity' : 'dimensions';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Dialog open={isProductSelectorOpen} onOpenChange={setIsProductSelectorOpen}>
          <DialogTrigger asChild>
             <div className="relative">
                <Button variant="outline" className="w-full h-12 rounded-lg bg-muted border-gray-300 justify-start text-left font-normal text-base">
                    <span className='truncate'>{watchedProductType ? productTypes.find(p => p.value === watchedProductType)?.label : "Select Product"}</span>
                </Button>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
             </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-0">
              <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
                  <DialogTitle>Select Product</DialogTitle>
                    <DialogClose asChild>
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
                          <X className="h-4 w-4" />
                      </Button>
                  </DialogClose>
              </DialogHeader>
              <div className="p-4">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                          placeholder="Search" 
                          className="pl-9 h-12 rounded-lg"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
              </div>
              <ScrollArea className="h-72">
                  <div className="p-4 pt-0">
                  {filteredProducts.map(product => (
                      <div 
                          key={product.value}
                          onClick={() => {
                              form.setValue('productType', product.value);
                              form.trigger('productType');
                              setIsProductSelectorOpen(false);
                          }}
                          className="py-3 border-b cursor-pointer hover:bg-muted"
                      >
                          {product.label}
                      </div>
                  ))}
                  </div>
              </ScrollArea>
              <div className="p-4 border-t flex justify-end">
                  <DialogClose asChild>
                      <Button type="button" variant="ghost">Close</Button>
                  </DialogClose>
              </div>
          </DialogContent>
        </Dialog>
        <FormField
            control={form.control}
            name="productType"
            render={({ field }) => (
            <FormItem>
                <FormControl>
                    <Input type="hidden" {...field} />
                </FormControl>
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
                    <Input placeholder="room" {...field} value={field.value ?? ''} className="h-12 rounded-lg bg-muted border-gray-300 text-base"/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        
        {formType === 'dimensions' ? (
             <div className='space-y-4'>
                <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                        <FormLabel className='text-sm font-medium'>Measurement in Inch</FormLabel>
                        <FormLabel className='text-sm font-medium'>In Feet</FormLabel>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <FormField control={form.control} name="height" render={({ field }) => (
                            <FormItem><FormControl><Input placeholder="Height" {...field} value={field.value ?? ''} type="number" className="h-12 rounded-lg bg-muted border-gray-300 text-base" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="width" render={({ field }) => (
                            <FormItem><FormControl><Input placeholder="Width" {...field} value={field.value ?? ''} type="number" className="h-12 rounded-lg bg-muted border-gray-300 text-base" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="depth" render={({ field }) => (
                            <FormItem><FormControl><Input placeholder="Depth" {...field} value={field.value ?? ''} type="number" className="h-12 rounded-lg bg-muted border-gray-300 text-base" /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>
                <div className="relative">
                    <Input 
                        value={`Total sqft : ${totalSqFt}`} 
                        readOnly 
                        className="h-12 rounded-lg bg-muted border-gray-300 font-medium text-base"
                    />
                </div>
                <FormField control={form.control} name="pricePerSqFt" render={({ field }) => (
                     <FormItem>
                        <FormLabel>Price per SQFT</FormLabel>
                        <FormControl><Input placeholder="Enter Price here" {...field} value={field.value ?? ''} type="number" className="h-12 rounded-lg bg-muted border-gray-300 text-base" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <div className="relative">
                    <Input 
                        value={`Total Price : ${totalPrice.toLocaleString('en-IN')}`} 
                        readOnly 
                        className="h-12 rounded-lg bg-muted border-gray-300 font-medium text-base"
                    />
                </div>
            </div>
        ) : (
            <div className='space-y-4'>
                <FormField control={form.control} name="quantity" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Product Quantity</FormLabel>
                        <FormControl><Input placeholder="e.g. 5" {...field} value={field.value ?? ''} type="number" className="h-12 rounded-lg bg-muted border-gray-300 text-base" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="pricePerQuantity" render={({ field }) => (
                     <FormItem>
                        <FormLabel>Product Price Per Quantity</FormLabel>
                        <FormControl><Input placeholder="e.g. 1500" {...field} value={field.value ?? ''} type="number" className="h-12 rounded-lg bg-muted border-gray-300 text-base" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="relative">
                    <Input 
                        value={`Total Price : ${totalPrice.toLocaleString('en-IN')}`} 
                        readOnly 
                        className="h-12 rounded-lg bg-muted border-gray-300 font-medium text-base"
                    />
                </div>
            </div>
        )}
        
        <Button type="submit" size="lg" className="w-full h-14 rounded-full text-lg bg-green-500 hover:bg-green-600" disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Now"}
        </Button>
      </form>
    </Form>
  );
}
