'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Phone, Mail, MapPin, Target, ChevronLeft, Bell } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';

const visitorSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  name: z.string().min(1, 'Full name is required'),
  assignTo: z.string().optional(),
  email: z.string().email('Please enter a valid email.').optional().or(z.literal('')),
  city: z.string().optional(),
  address: z.string().optional(),
  purpose: z.string().optional(),
  status: z.string().optional(),
});

type VisitorFormData = z.infer<typeof visitorSchema>;

export default function VisitorEditPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const firestore = useFirestore();

  const { visitorId } = params as { visitorId: string };

  const visitorDocRef = useMemoFirebase(() => {
    if (!firestore || !user || !visitorId) return null;
    return doc(firestore, 'users', user.uid, 'visitors', visitorId);
  }, [firestore, user, visitorId]);

  const { data: visitorData, isLoading: isVisitorLoading } = useDoc<VisitorFormData>(visitorDocRef);

  const form = useForm<VisitorFormData>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      phone: '',
      name: '',
      assignTo: '',
      email: '',
      city: '',
      address: '',
      purpose: '',
      status: '',
    },
  });

  useEffect(() => {
    if (visitorData) {
      form.reset(visitorData);
    }
  }, [visitorData, form]);

  const onSubmit = (values: VisitorFormData) => {
    if (!visitorDocRef) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update visitor.",
      });
      return;
    }

    setDocumentNonBlocking(visitorDocRef, values, { merge: true });

    toast({
      title: 'Visitor Updated',
      description: `${values.name}'s details have been updated.`,
    });
    
    router.back();
  };

  const isLoading = isVisitorLoading || form.formState.isSubmitting;

  return (
    <div className="flex flex-col min-h-dvh bg-muted text-foreground">
       <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Visitor Details</h1>
        </div>
        <div className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-card rounded-t-3xl">
        {isVisitorLoading ? (
            <div className="space-y-6">
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full mt-4" />
            </div>
        ) : (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Phone Number" {...field} className="pl-10 h-12 rounded-full bg-muted border-none" />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Full Name" {...field} className="pl-10 h-12 rounded-full bg-muted border-none" />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="assignTo"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Assign to" {...field} className="pl-10 h-12 rounded-full bg-muted border-none" />
                        </div>
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
                    <FormControl>
                        <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Email" {...field} className="pl-10 h-12 rounded-full bg-muted border-none" />
                        </div>
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
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-12 rounded-full bg-muted border-none text-muted-foreground">
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="mumbai">Mumbai</SelectItem>
                                    <SelectItem value="delhi">Delhi</SelectItem>
                                    <SelectItem value="bangalore">Bangalore</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Address" {...field} className="pl-10 h-12 rounded-full bg-muted border-none" />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <div className="relative">
                        <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Purpose" {...field} className="pl-10 h-12 rounded-full bg-muted border-none" />
                        </div>
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
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-12 rounded-full bg-muted border-none text-muted-foreground">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="hot">Hot</SelectItem>
                                    <SelectItem value="warm">Warm</SelectItem>
                                    <SelectItem value="cold">Cold</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" size="lg" className="w-full rounded-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
                </Button>
            </form>
            </Form>
        )}
      </main>
    </div>
  );
}
