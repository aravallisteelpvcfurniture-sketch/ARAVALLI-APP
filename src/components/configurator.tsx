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
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Loader2, Save } from "lucide-react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection } from "firebase/firestore";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  material: z.string().min(1, "Please select a material."),
  dimensions: z.object({
    length: z.coerce.number().min(1, "Length is required").min(50).max(300),
    width: z.coerce.number().min(1, "Width is required").min(30).max(200),
    height: z.coerce.number().min(1, "Height is required").min(40).max(250),
  }),
  features: z.array(z.string()).optional(),
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

  const getInitialConfig = useCallback(() => {
    return {
      ...DEFAULT_CONFIG,
      dimensions: {
        length: initialDimensions?.length || DEFAULT_CONFIG.dimensions.length,
        width: initialDimensions?.width || DEFAULT_CONFIG.dimensions.width,
        height: initialDimensions?.height || DEFAULT_CONFIG.dimensions.height,
      }
    }
  }, [initialDimensions]);

  const [cost, setCost] = useState<Cost | null>(null);
  
  const [isCostLoading, startCostTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

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

  const updateCost = useCallback((newConfig: FurnitureConfig) => {
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
        const newConfig = form.getValues();
        updateCost(newConfig);
      }
    }, 500);

    return () => clearTimeout(debouncer);
  }, [watchedValues, form, updateCost]);


  function handleSaveQuotation() {
    const currentConfig = form.getValues();

    if (!furnitureConfigurationsRef || !user?.uid || !cost) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save quotation. Please make sure you are logged in and a visitor is selected.',
      });
      return;
    }

    const furnitureConfigurationData = {
        userId: user.uid,
        materialId: currentConfig.material,
        ...currentConfig.dimensions,
        drawers: currentConfig.features?.includes('drawers') ? 1 : 0,
        shelves: currentConfig.features?.includes('shelves') ? 1 : 0,
        doors: currentConfig.features?.includes('doors') ? 1 : 0,
        estimatedCost: cost.estimatedCost,
        configurationDate: new Date().toISOString(),
    };

    addDocumentNonBlocking(furnitureConfigurationsRef, furnitureConfigurationData);

    toast({
      title: "Quotation Saved!",
      description: "The furniture configuration has been saved for this visitor.",
    });
  }

  return (
    <div className="p-4 -mt-32">
        <Card className="rounded-2xl shadow-xl">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSaveQuotation)} className="space-y-8">
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
                    <FormLabel>Dimensions (cm)</FormLabel>
                     <div className="grid grid-cols-3 gap-4">
                        <FormField control={form.control} name="dimensions.length" render={({ field }) => (
                            <FormItem><FormLabel className="text-sm font-normal text-muted-foreground">Length</FormLabel><FormControl><Input placeholder="e.g. 120" {...field} type="number" className="h-12 text-base" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="dimensions.width" render={({ field }) => (
                            <FormItem><FormLabel className="text-sm font-normal text-muted-foreground">Width</FormLabel><FormControl><Input placeholder="e.g. 60" {...field} type="number" className="h-12 text-base" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="dimensions.height" render={({ field }) => (
                            <FormItem><FormLabel className="text-sm font-normal text-muted-foreground">Height</FormLabel><FormControl><Input placeholder="e.g. 75" {...field} type="number" className="h-12 text-base" /></FormControl><FormMessage /></FormItem>
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
                                        value={value}
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
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                        <DollarSign className="h-6 w-6" /> Estimated Cost
                      </p>
                      {isCostLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                    </div>
                     {isMounted && !isCostLoading && cost ? (
                        <p className="text-5xl font-bold text-primary">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: cost.currency || 'INR', minimumFractionDigits: 0 }).format(cost.estimatedCost)}
                        </p>
                     ) : (
                        <Skeleton className="h-12 w-48" />
                     )}
                  </div>


                  <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={isCostLoading || !visitorId}>
                    <Save className="mr-2 h-5 w-5" />
                    Save Quotation
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
    </div>
  );
}

const ToggleGroup = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, variant, size, ...props }, ref) => (
    <ToggleGroupPrimitive.Root
        ref={ref}
        className={cn("flex items-center justify-center gap-1", className)}
        {...props}
    />
));

const ToggleGroupPrimitive = require("@radix-ui/react-toggle-group");

const toggleGroupItemVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleGroupItemVariants>
>(({ className, variant, size, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(toggleGroupItemVariants({ variant, size, className }))}
    {...props}
  />
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }

type VariantProps<T> = import('class-variance-authority').VariantProps<T>

