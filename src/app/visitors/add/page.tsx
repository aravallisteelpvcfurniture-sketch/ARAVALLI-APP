'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Phone, Mail, MapPin, Target, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const visitorSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  name: z.string().min(1, 'Full name is required'),
  assignTo: z.string().optional(),
  email: z.string().email('Please enter a valid email.').optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  purpose: z.string().optional(),
  status: z.string().optional(),
});

export default function AddVisitorPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  const visitorsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'visitors');
  }, [firestore, user]);

  const form = useForm<z.infer<typeof visitorSchema>>({
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

  const onSubmit = (values: z.infer<typeof visitorSchema>) => {
    if (!visitorsCollectionRef) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to add a visitor.",
        });
        return;
    }

    addDocumentNonBlocking(visitorsCollectionRef, values);

    toast({
      title: 'Visitor Added',
      description: `${values.name} has been added to your visitor list.`,
    });
    
    router.push('/visitors');
  };

  return (
    <div className="flex flex-col min-h-dvh bg-muted text-foreground">
      <Header title="Add Visitor" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-card rounded-t-3xl">
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <Button type="submit" size="lg" className="w-full rounded-full" disabled={form.formState.isSubmitting || !visitorsCollectionRef}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Visitor
            </Button>
          </form>
        </Form>
      </main>
    </div>
  );
}
