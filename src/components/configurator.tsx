"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getCost, getSuggestions } from "@/lib/actions";
import type { Cost, Suggestions, FurnitureConfig } from "@/lib/types";
import { DEFAULT_CONFIG, MATERIALS, FEATURES } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FurniturePreview } from "@/components/furniture-preview";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DollarSign, Lightbulb, Loader2, Send } from "lucide-react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection } from "firebase/firestore";

const formSchema = z.object({
  material: z.string().min(1, "Please select a material."),
  dimensions: z.object({
    length: z.number().min(50).max(300),
    width: z.number().min(30).max(200),
    height: z.number().min(40).max(250),
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

  const [config, setConfig] = useState<FurnitureConfig>(getInitialConfig());
  const [cost, setCost] = useState<Cost | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  
  const [isCostLoading, startCostTransition] = useTransition();
  const [isSuggestionsLoading, startSuggestionsTransition] = useTransition();
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
    setConfig(newConfig);
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
        setConfig(newConfig);
        updateCost(newConfig);
      }
    }, 500);

    return () => clearTimeout(debouncer);
  }, [watchedValues.dimensions, watchedValues.material, watchedValues.features, form, updateCost]);

  function handleGetSuggestions() {
    startSuggestionsTransition(async () => {
      const result = await getSuggestions(config);
      if (result) {
        setSuggestions(result);
        toast({
          title: "Suggestions ready!",
          description: "We've generated some design improvements for you.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch suggestions. Please try again.",
        });
      }
    });
  }

  function handleOrder() {
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
        materialId: config.material,
        ...config.dimensions,
        drawers: config.features?.includes('drawers') ? 1 : 0,
        shelves: config.features?.includes('shelves') ? 1 : 0,
        doors: config.features?.includes('doors') ? 1 : 0,
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
    <div className="container mx-auto max-w-7xl p-0 md:p-4 lg:p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
        
        {/* Left column: Controls */}
        <div className="lg:col-span-2">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Customize Furniture</CardTitle>
              <CardDescription>
                Select materials, dimensions, and features for the quotation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-8">
                  <FormField
                    control={form.control}
                    name="material"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Material</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {MATERIALS.map((material) => (
                              <FormItem key={material.id} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={material.id} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {material.name}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <FormLabel>Dimensions (cm)</FormLabel>
                    <FormField
                      control={form.control}
                      name="dimensions.length"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between">
                            <FormLabel className="text-sm font-normal">Length</FormLabel>
                            <span className="text-sm font-medium text-primary">{field.value} cm</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={50}
                              max={300}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dimensions.width"
                      render={({ field }) => (
                        <FormItem>
                           <div className="flex justify-between">
                            <FormLabel className="text-sm font-normal">Width</FormLabel>
                            <span className="text-sm font-medium text-primary">{field.value} cm</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={30}
                              max={200}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dimensions.height"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between">
                            <FormLabel className="text-sm font-normal">Height</FormLabel>
                            <span className="text-sm font-medium text-primary">{field.value} cm</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={40}
                              max={250}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="features"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Features</FormLabel>
                        </div>
                        {FEATURES.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="features"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal flex items-center gap-2">
                                    <item.icon className="h-4 w-4 text-muted-foreground" /> {item.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column: Preview, Cost, Suggestions */}
        <div className="lg:col-span-3 space-y-8">
          <FurniturePreview config={config} />
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-primary" />
                <CardTitle>Cost Estimation</CardTitle>
              </div>
              {isCostLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              {isMounted && !isCostLoading && cost ? (
                <div>
                  <p className="text-4xl font-bold text-primary">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: cost.currency || 'USD' }).format(cost.estimatedCost)}
                  </p>
                  {cost.breakdown && (
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {Object.entries(cost.breakdown).map(([key, value]) => (
                        <li key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" disabled={isCostLoading || !visitorId}>
                    <Send className="mr-2 h-4 w-4" /> {visitorId ? 'Save Quotation' : 'Place Order'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Your Quotation</DialogTitle>
                    <DialogDescription>
                      Review your custom furniture details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Your Configuration:</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Material: <span className="font-medium text-foreground">{config.material}</span></li>
                      <li>Dimensions: <span className="font-medium text-foreground">{config.dimensions.length}x{config.dimensions.width}x{config.dimensions.height} cm</span></li>
                      <li>Features: <span className="font-medium text-foreground">{config.features?.join(', ') || 'None'}</span></li>
                    </ul>
                    <Separator />
                    <div className="flex justify-between items-center font-bold">
                      <span>Total Cost:</span>
                      <span className="text-primary text-xl">
                        {cost ? new Intl.NumberFormat('en-US', { style: 'currency', currency: cost.currency || 'USD' }).format(cost.estimatedCost) : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={handleOrder}>Confirm & Save</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-accent" />
                <CardTitle>AI Design Suggestions</CardTitle>
              </div>
              <Button size="sm" onClick={handleGetSuggestions} disabled={isSuggestionsLoading}>
                {isSuggestionsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Suggest'}
              </Button>
            </CardHeader>
            <CardContent>
              {isSuggestionsLoading && !suggestions && (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              )}
              {suggestions ? (
                <Accordion type="single" collapsible defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>View Suggestions</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc space-y-2 pl-5">
                        {suggestions.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Reasoning</AccordionTrigger>
                    <AccordionContent>
                      {suggestions.reasoning}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                !isSuggestionsLoading && <p className="text-sm text-muted-foreground">Click the button to generate AI-powered design improvements.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
