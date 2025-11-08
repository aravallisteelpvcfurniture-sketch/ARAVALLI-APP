"use client";

import React from "react";
import { useUser, useAuth, initiateGoogleSignIn, initiateEmailSignUp, initiateEmailSignIn, requestSignOut } from "@/firebase";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});


export function AuthButton() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isAuthModalOpen, setAuthModalOpen] = React.useState(false);
  
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });


  const handleGoogleSignIn = () => {
    initiateGoogleSignIn(auth);
    setAuthModalOpen(false);
  };

  const handleEmailSignUp = (values: z.infer<typeof signUpSchema>) => {
    initiateEmailSignUp(auth, values.email, values.password);
    setAuthModalOpen(false);
  };
  
  const handleEmailSignIn = (values: z.infer<typeof signInSchema>) => {
    initiateEmailSignIn(auth, values.email, values.password);
    setAuthModalOpen(false);
  };

  const handleSignOut = () => {
    requestSignOut(auth);
  };
  
  if (isUserLoading) {
    return <Skeleton className="h-10 w-24" />;
  }

  if (!user) {
    return (
      <>
        <Button onClick={() => setAuthModalOpen(true)}>
          <LogIn className="mr-2" />
          Login
        </Button>
        <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
          <DialogContent className="sm:max-w-md">
            <Tabs defaultValue="signin">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl">Welcome</DialogTitle>
                <DialogDescription className="text-center">
                  Sign in or create an account to save your configurations.
                </DialogDescription>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </DialogHeader>

              <TabsContent value="signin">
                <div className="space-y-4 py-4">
                 <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12h-8c0 11.045 8.955 20 20 20z" />
                      <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C44.473 36.566 48 30.836 48 24c0-1.341-.138-2.65-.389-3.917z" />
                    </svg>
                    Sign in with Google
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  <Form {...signInForm}>
                    <form onSubmit={signInForm.handleSubmit(handleEmailSignIn)} className="space-y-4">
                      <FormField control={signInForm.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="m@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={signInForm.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="submit" className="w-full">Sign In</Button>
                    </form>
                  </Form>
                </div>
              </TabsContent>

              <TabsContent value="signup">
                <div className="space-y-4 py-4">
                 <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12h-8c0 11.045 8.955 20 20 20z" />
                      <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C44.473 36.566 48 30.836 48 24c0-1.341-.138-2.65-.389-3.917z" />
                    </svg>
                    Sign up with Google
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                   <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(handleEmailSignUp)} className="space-y-4">
                      <FormField control={signUpForm.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="m@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={signUpForm.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="submit" className="w-full">Sign Up</Button>
                    </form>
                  </Form>
                </div>
              </TabsContent>
              <DialogFooter>
                <p className="text-xs text-muted-foreground text-center w-full">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
              </DialogFooter>
            </Tabs>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? "User"} />
            <AvatarFallback>
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}