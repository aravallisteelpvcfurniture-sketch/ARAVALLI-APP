"use client";

import React from "react";
import { useAuth, initiateGoogleSignIn, initiateEmailSignUp, initiateEmailSignIn } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { AravalliLogo } from "./aravalli-logo";
import { Loader2 } from "lucide-react";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});


export function AuthComponent() {
  const auth = useAuth();
  
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });


  const handleGoogleSignIn = () => {
    if (auth) {
      initiateGoogleSignIn(auth);
    }
  };

  const handleEmailSignUp = (values: z.infer<typeof signUpSchema>) => {
    if (auth) {
      initiateEmailSignUp(auth, values.email, values.password);
    }
  };
  
  const handleEmailSignIn = (values: z.infer<typeof signInSchema>) => {
    if (auth) {
      initiateEmailSignIn(auth, values.email, values.password);
    }
  };
  
  return (
      <Card className="w-full max-w-sm rounded-2xl bg-card/80 backdrop-blur-sm border-white/20 shadow-2xl">
        <CardHeader className="text-center items-center gap-4">
            <AravalliLogo className="h-14" />
            <div className="text-card-foreground">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription className="text-card-foreground/80">
                    Sign in to access your dashboard
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent className="p-6">
        <div className="space-y-4">
             <Button variant="outline" className="w-full h-12 text-base border-2 border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary-foreground font-bold" onClick={handleGoogleSignIn}>
                <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12h-8c0 11.045 8.955 20 20 20z" />
                    <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C44.473 36.566 48 30.836 48 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
                Sign in with Google
            </Button>
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-card-foreground/80">Or continue with</span>
                </div>
            </div>
        </div>
        <Tabs defaultValue="signin" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
                <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleEmailSignIn)} className="space-y-4 pt-4">
                    <FormField control={signInForm.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="m@example.com" {...field} className="h-12"/></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={signInForm.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} className="h-12" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" className="w-full h-12 text-base" disabled={signInForm.formState.isSubmitting}>
                        {signInForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                </form>
                </Form>
            </TabsContent>
            <TabsContent value="signup">
                 <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleEmailSignUp)} className="space-y-4 pt-4">
                    <FormField control={signUpForm.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="m@example.com" {...field} className="h-12"/></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={signUpForm.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} className="h-12"/></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" className="w-full h-12 text-base" disabled={signUpForm.formState.isSubmitting}>
                         {signUpForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign Up
                    </Button>
                </form>
                </Form>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
