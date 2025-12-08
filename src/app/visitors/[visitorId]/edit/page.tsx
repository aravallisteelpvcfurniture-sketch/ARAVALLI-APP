'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useFirestore, useMemoFirebase, useDoc, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Bell, ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from '@/components/ui/skeleton';
import type { Visitor } from '@/lib/types';

const visitorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  email: z.string().email('Please enter a valid email.').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  assignTo: z.string().optional(),
  purpose: z.string().optional(),
  status: z.enum(['Hot', 'Warm', 'Cold']).optional(),
});

export default function EditVisitorPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { visitorId } = useParams();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const visitorDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return doc(firestore, 'users', user.uid, 'visitors', visitorId as string);
  }, [firestore, user?.uid, visitorId]);

  const { data: visitor, isLoading } = useDoc<Visitor>(visitorDocRef);

  const form = useForm<z.infer<typeof visitorSchema>>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      assignTo: '',
      purpose: '',
    },
  });

  useEffect(() => {
    if (visitor) {
      form.reset(visitor);
    }
  }, [visitor, form]);


  const onSubmit = (values: z.infer<typeof visitorSchema>) => {
    if (!visitorDocRef) return;
    setIsSaving(true);
    
    updateDocumentNonBlocking(visitorDocRef, values);
    
    toast({
        title: 'Visitor Updated',
        description: 'The visitor information has been successfully updated.',
    });
    router.push(`/visitors/${visitorId}`);

    setIsSaving(false);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
       <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className='flex items-center gap-4'>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">Edit Visitor</h1>
            </div>
            <Bell className="h-6 w-6" />
        </header>
      <main className="flex-1 flex flex-col items-center p-4">
        <Card className="w-full max-w-2xl rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Update Information</CardTitle>
            <CardDescription>Modify the details for this client or lead.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. 9876543210" {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. john.doe@example.com" {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Address (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. 123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>City (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Jaipur" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Lead Status (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select lead status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="Hot">Hot</SelectItem>
                            <SelectItem value="Warm">Warm</SelectItem>
                            <SelectItem value="Cold">Cold</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" size="lg" className="w-full h-14 rounded-full text-lg" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Update Visitor
                    </Button>
                </form>
                </Form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
