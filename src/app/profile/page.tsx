'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useUser, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  companyName: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email('Please enter a valid email.').optional(),
});

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      companyName: '',
      mobile: '',
      email: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        companyName: userProfile.companyName || '',
        mobile: userProfile.mobile || '',
        email: userProfile.email || user?.email || '',
      });
    } else if (user) {
      form.reset({
        email: user.email || '',
        companyName: '',
        mobile: '',
      });
    }
  }, [userProfile, user, form]);

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    if (!userProfileRef) return;
    
    setDocumentNonBlocking(userProfileRef, values, { merge: true });

    toast({
      title: 'Profile Updated',
      description: 'Your company information has been saved.',
    });
  };
  
  const isLoading = isUserLoading || isProfileLoading;

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center">
        <Card className="w-full max-w-2xl h-fit">
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>
              This information will be used automatically in the greetings editor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
            ) : (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your Company Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                            <Input placeholder="+91 98765 43210" {...field} />
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
                        <FormLabel>Public Email</FormLabel>
                        <FormControl>
                            <Input placeholder="contact@yourcompany.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </form>
                </Form>
            )}
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}
