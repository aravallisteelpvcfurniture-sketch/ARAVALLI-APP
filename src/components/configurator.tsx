"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { FurnitureConfig } from "@/lib/types";
import { DEFAULT_CONFIG, MATERIALS, FEATURES } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, doc } from "firebase/firestore";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const formSchema = z.object({
  material: z.string().min(1, "Please select a material."),
  dimensions: z.object({
    length: z.coerce.number().min(1, "Length is required").min(50).max(300),
    width: z.coerce.number().min(1, "Width is required"),
    height: z.coerce.number().min(1, "Height is required"),
  }),
  features: z.array(z.string()).optional(),
  finalPrice: z.coerce.number().optional(),
});

interface ConfiguratorProps {
  onConfigChange: (config: FurnitureConfig) => void;
}

export function Configurator({ onConfigChange }: ConfiguratorProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);

  const furnitureConfigurationsRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'furnitureConfigurations');
  }, [firestore, user?.uid]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_CONFIG,
  });

  const watchedValues = form.watch();

  useEffect(() => {
    const subscription = form.watch((value) => {
        const { finalPrice, ...newConfig } = value as z.infer<typeof formSchema>;
        if (form.formState.isValid) {
            onConfigChange(newConfig as FurnitureConfig);
        }
    });
    // Initial call
    if (form.formState.isValid) {
        const { finalPrice, ...newConfig } = form.getValues();
        onConfigChange(newConfig as FurnitureConfig);
    }
    return () => subscription.unsubscribe();
  }, [form, onConfigChange]);


  const handleSaveAndShare = async () => {
    setIsSaving(true);
    const currentConfig = form.getValues();
    const finalPrice = currentConfig.finalPrice; // This will be handled by the parent

    if (!furnitureConfigurationsRef || !user?.uid) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save quotation. Please make sure you are logged in.',
      });
      setIsSaving(false);
      return;
    }

    const furnitureConfigurationData = {
        userId: user.uid,
        material: currentConfig.material,
        ...currentConfig.dimensions,
        features: currentConfig.features || [],
        finalPrice: finalPrice || 0, // Parent will provide final cost
        configurationDate: new Date().toISOString(),
    };

    try {
        const newDocRef = doc(furnitureConfigurationsRef);
        await addDocumentNonBlocking(furnitureConfigurationsRef, furnitureConfigurationData, newDocRef);

        toast({
          title: "Quotation Saved!",
          description: "The furniture configuration has been saved.",
        });
        
        console.log("Quotation saved with ID:", newDocRef.id);

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'Could not save the quotation.',
        });
    } finally {
        setIsSaving(false);
    }
  }
  
  return (
    <div className="md:-mt-32">
        <Card className="rounded-2xl shadow-xl">
            <CardContent className="p-6">
              <Form {...form}>
                <form className="space-y-8">
                  <FormField
                    control={form.control}
                    name="material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material</FormLabel>
                        <FormControl>
                            <Controller
                                control={form.control}
                                name="material"
                                render={({ field }) => (
                                    <ToggleGroup
                                        type="single"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className="grid grid-cols-3 gap-2"
                                    >
                                        {MATERIALS.map((material) => (
                                            <ToggleGroupItem key={material.id} value={material.id} className="h-12 text-base">
                                                {material.name}
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                )}
                            />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormLabel>Dimensions</FormLabel>
                     <div className="grid grid-cols-3 gap-4">
                        <FormField control={form.control} name="dimensions.length" render={({ field }) => (
                            <FormItem><FormLabel className="text-sm font-normal text-muted-foreground">Length (cm)</FormLabel><FormControl><Input placeholder="e.g. 120" {...field} type="number" className="h-12 text-base" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="dimensions.width" render={({ field }) => (
                            <FormItem><FormLabel className="text-sm font-normal text-muted-foreground">Width (cm)</FormLabel><FormControl><Input placeholder="e.g. 60" {...field} type="number" className="h-12 text-base" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="dimensions.height" render={({ field }) => (
                            <FormItem><FormLabel className="text-sm font-normal text-muted-foreground">Height (cm)</FormLabel><FormControl><Input placeholder="e.g. 75" {...field} type="number" className="h-12 text-base" /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel>Features</FormLabel>
                          <FormControl>
                            <Controller
                                control={form.control}
                                name="features"
                                render={({ field: { onChange, value } }) => (
                                    <ToggleGroup
                                        type="multiple"
                                        value={value || []}
                                        onValueChange={onChange}
                                        className="grid grid-cols-3 gap-2"
                                    >
                                        {FEATURES.map((feature) => (
                                            <ToggleGroupItem key={feature.id} value={feature.id} className="h-12 text-base gap-2">
                                                <feature.icon className="h-5 w-5" />
                                                {feature.name}
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                )}
                            />
                          </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="finalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium">Final Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter final price (optional)" 
                            {...field}
                            value={field.value ?? ''}
                            className="h-12 text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4">
                    <Button type="button" onClick={handleSaveAndShare} size="lg" className="w-full h-14 text-lg" disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                        Save Configuration
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
    </div>
  );
}