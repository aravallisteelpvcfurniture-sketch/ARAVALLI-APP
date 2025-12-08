'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Configurator } from '@/components/configurator';
import { FurniturePreview } from '@/components/furniture-preview';
import type { FurnitureConfig } from '@/lib/types';
import { DEFAULT_CONFIG } from '@/lib/constants';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getCost } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EstimatePage() {
  const [config, setConfig] = useState<FurnitureConfig>(DEFAULT_CONFIG);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [isCostLoading, setIsCostLoading] = useState(false);
  const { toast } = useToast();

  const handleConfigChange = async (newConfig: FurnitureConfig) => {
    setConfig(newConfig);
    setIsCostLoading(true);
    try {
      const costResult = await getCost({
        material: newConfig.material,
        dimensions: newConfig.dimensions,
        features: newConfig.features,
      });
      if (costResult) {
        setEstimatedCost(costResult.estimatedCost);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch cost estimation.',
      });
    } finally {
      setIsCostLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
      <Header title="Estimate Furniture Cost" />
      
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full bg-primary h-32" />
        <div className="w-full px-4 -mt-24 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <FurniturePreview config={config} />
            <Card className="rounded-2xl shadow-xl">
              <CardHeader>
                <CardTitle>Estimated Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold flex items-center">
                  {isCostLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    `₹${estimatedCost ? estimatedCost.toLocaleString('en-IN') : '...'}`
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  This is an approximate cost. Final price may vary.
                </p>
              </CardContent>
              <CardFooter>
                 <Button disabled className='w-full' variant={'outline'}>More Details</Button>
              </CardFooter>
            </Card>
          </div>
          <Configurator onConfigChange={handleConfigChange} />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
