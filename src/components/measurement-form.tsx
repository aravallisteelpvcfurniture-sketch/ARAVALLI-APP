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
import { Loader2, Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from './ui/scroll-area';

const measurementSchema = z.object({
  title: z.string().optional(),
  productType: z.string().min(1, 'Product type is required.'),
  quantity: z.coerce.number().min(1, 'Quantity is required'),
  pricePerQuantity: z.coerce.number().min(1, 'Price is required'),
});

interface MeasurementFormProps {
  visitorId: string;
  onSave: () => void;
  title?: string;
  buttonText?: string;
}

const productTypes = [
    { value: 'modular-kitchen', label: 'MODULAR KITCHEN' },
    { value: 'baskets', label: 'BASKETS' },
    { value: 'self-partition', label: 'SELF/PARTITION' },
    { value: 'crockery', label: 'CROCKERY' },
    { value: 'framing', label: 'FRAMING' },
    { value: 'box', label: 'BOX' },
    { value: 'wardrobe', label: 'WARDROBE' },
    { value: 'tv-unit', label: 'TV UNIT' },
];

export function MeasurementForm({ visitorId, onSave, title: formTitle, buttonText }: MeasurementFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const measurementsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return collection(firestore, 'users', user.uid, 'visitors', visitorId, 'measurements');
  }, [firestore, user?.uid, visitorId]);

  const form = useForm<z.infer<typeof measurementSchema>>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      title: '',
      productType: '',
      quantity: undefined,
      pricePerQuantity: undefined,
    },
  });
  
  const watchedValues = form.watch();

  useEffect(() => {
    const { quantity, pricePerQuantity } = watchedValues;
    const q = quantity || 0;
    const p = pricePerQuantity || 0;
    const total = q * p;
    setTotalPrice(total);
  }, [watchedValues]);


  const onSubmit = async (values: z.infer<typeof measurementSchema>) => {
    if (!measurementsCollectionRef) return;

    setIsSaving(true);

    const measurementData: any = {
      ...values,
      totalPrice,
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
  
  const filteredProducts = productTypes.filter(p => p.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
            control={form.control}
            name="productType"
            render={({ field }) => (
                <FormItem>
                    <Dialog open={isProductSelectorOpen} onOpenChange={setIsProductSelectorOpen}>
                        <DialogTrigger asChild>
                             <Button variant="outline" className="w-full h-12 rounded-lg bg-muted border-gray-300 justify-between text-left font-normal text-base">
                                {field.value ? productTypes.find(p => p.value === field.value)?.label : "Select Product"}
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
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
                                            field.onChange(product.value);
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
                    <Input placeholder="Title" {...field} className="h-12 rounded-lg bg-muted border-gray-300 text-base"/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
            <FormItem>
                <FormControl>
                    <Input type="number" placeholder="Product Quantity" {...field} className="h-12 rounded-lg bg-muted border-gray-300 text-base" />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="pricePerQuantity"
            render={({ field }) => (
            <FormItem>
                <FormControl>
                    <Input type="number" placeholder="Product Price Per Quantity" {...field} className="h-12 rounded-lg bg-muted border-gray-300 text-base" />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <div className="relative">
            <Input 
                value={`Total Price : ${totalPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`} 
                readOnly 
                className="h-12 rounded-lg bg-muted border-gray-300 font-medium text-base"
            />
        </div>
        
        <Button type="submit" size="lg" className="w-full h-14 rounded-full text-lg bg-green-500 hover:bg-green-600" disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (buttonText || "Add Now")}
        </Button>
      </form>
    </Form>
  );
}

// Dummy ChevronDown icon if not available elsewhere
const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
