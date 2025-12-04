"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getCost } from "@/lib/actions";
import type { Cost, FurnitureConfig } from "@/lib/types";
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
import { Loader2, Save, Share2 } from "lucide-react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, doc } from "firebase/firestore";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useRouter } from "next/navigation";

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
  visitorId?: string;
  initialDimensions?: {
    length?: number;
    width?: number;
    height?: number;
  }
}

export function Configurator({ visitorId, initialDimensions }: ConfiguratorProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const getInitialConfig = useCallback(() => {
    // Width and Height come from measurement, Length is default
    return {
      ...DEFAULT_CONFIG,
      dimensions: {
        length: DEFAULT_CONFIG.dimensions.length, // Keep default length
        width: initialDimensions?.width || DEFAULT_CONFIG.dimensions.width,
        height: initialDimensions?.height || DEFAULT_CONFIG.dimensions.height,
      },
      finalPrice: undefined,
    }
  }, [initialDimensions]);

  const [cost, setCost] = useState<Cost | null>(null);
  
  const [isCostLoading, startCostTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const furnitureConfigurationsRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !visitorId) return null;
    return collection(firestore, 'users', user.uid, 'visitors', visitorId, 'furnitureConfigurations');
  }, [firestore, user?.uid, visitorId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialConfig(),
  });
  
  useEffect(() => {
    const newConfig = getInitialConfig();
    form.reset(newConfig);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDimensions, form]);

  const watchedValues = form.watch();

  const updateCost = useCallback((newConfig: Omit<FurnitureConfig, 'finalPrice'>) => {
    startCostTransition(async () => {
      const result = await getCost(newConfig);
      if (result) {
        setCost(result);
      }
    });
  }, []);

  useEffect(() => {
    setIsMounted(true);
    // Initial cost calculation
    updateCost(getInitialConfig());
  }, [updateCost, getInitialConfig]);
  
  useEffect(() => {
    const debouncer = setTimeout(() => {
      if (form.formState.isValid) {
        const { finalPrice, ...newConfig } = form.getValues();
        updateCost(newConfig);
      }
    }, 500);

    return () => clearTimeout(debouncer);
  }, [watchedValues, form, updateCost]);


  const handleSaveAndShare = async () => {
    setIsSaving(true);
    const currentConfig = form.getValues();

    if (!furnitureConfigurationsRef || !user?.uid || !cost) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save quotation. Please make sure you are logged in and a visitor is selected.',
      });
      setIsSaving(false);
      return;
    }

    const finalPrice = currentConfig.finalPrice || cost.estimatedCost;

    const furnitureConfigurationData = {
        userId: user.uid,
        visitorId: visitorId,
        material: currentConfig.material,
        ...currentConfig.dimensions,
        features: currentConfig.features || [],
        estimatedCost: cost.estimatedCost,
        finalPrice: finalPrice,
        configurationDate: new Date().toISOString(),
    };

    try {
        const newDocRef = doc(furnitureConfigurationsRef); // Create a new doc reference with an auto-generated ID
        await addDocumentNonBlocking(furnitureConfigurationsRef, furnitureConfigurationData, newDocRef);

        toast({
          title: "Quotation Saved!",
          description: "The furniture configuration has been saved for this visitor.",
        });
        
        // Share functionality
        const shareUrl = `${window.location.origin}/visitors/${visitorId}/quotation/${newDocRef.id}`;
        if (navigator.share) {
            navigator.share({
                title: 'Furniture Quotation',
                text: 'Here is the furniture quotation we discussed.',
                url: shareUrl,
            }).catch((error) => console.error('Error sharing', error));
        } else {
            // Fallback for browsers that don't support navigator.share
            navigator.clipboard.writeText(shareUrl);
            toast({
                title: "Link Copied!",
                description: "Quotation link copied to clipboard.",
            });
        }

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
  
  const isLoading = isSaving || isCostLoading;

  return (
    <div className="p-4 -mt-32">
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
                            <FormItem><FormLabel className="text-sm font-normal text-muted-foreground">Width (ft)</FormLabel><FormControl><Input placeholder="e.g. 2" {...field} type="number" className="h-12 text-base" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="dimensions.height" render={({ field }) => (
                            <FormItem><FormLabel className="text-sm font-normal text-muted-foreground">Height (ft)</FormLabel><FormControl><Input placeholder="e.g. 3" {...field} type="number" className="h-12 text-base" /></FormControl><FormMessage /></FormItem>
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
                    <Button type="button" onClick={handleSaveAndShare} size="lg" className="w-full h-14 text-lg" disabled={isLoading || !visitorId}>
                        {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Share2 className="mr-2 h-5 w-5" />}
                        Save & Share
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
    </div>
  );
}

    