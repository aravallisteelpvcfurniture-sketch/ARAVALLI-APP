'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemoFirebase, useDoc, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MATERIALS, FEATURES } from '@/lib/constants';
import { DollarSign } from 'lucide-react';
import type { QuotationData } from '@/lib/types';
import { FurniturePreview } from '@/components/furniture-preview';

function QuotationDisplay() {
  const params = useParams();
  const { user } = useUser();

  const { visitorId, quotationId } = params as { visitorId: string; quotationId: string };

  const quotationRef = useMemoFirebase(() => {
    if (!user?.uid || !visitorId || !quotationId) return null;
    return doc(
      user.firestore,
      'users',
      user.uid,
      'visitors',
      visitorId,
      'furnitureConfigurations',
      quotationId
    );
  }, [user?.uid, user?.firestore, visitorId, quotationId]);
  
  const { data: quotation, isLoading } = useDoc<QuotationData>(quotationRef);

  const getMaterialName = (id: string) => MATERIALS.find(m => m.id === id)?.name || id;
  const getFeatureName = (id: string) => FEATURES.find(f => f.id === id)?.name || id;

  if (isLoading) {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-4">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Quotation not found.
      </div>
    );
  }
  
  const furnitureConfig = {
      material: quotation.material,
      dimensions: {
          length: quotation.length,
          width: quotation.width,
          height: quotation.height
      },
      features: quotation.features
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Furniture Quotation</h1>
                <p className="text-sm text-muted-foreground">
                    Generated on {new Date(quotation.configurationDate).toLocaleDateString()}
                </p>
            </div>
            
            <FurniturePreview config={furnitureConfig} />

            <div className="mt-6 grid gap-6">
                <Card>
                    <CardHeader><CardTitle>Configuration Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold">Material</h4>
                            <p>{getMaterialName(quotation.material)}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Dimensions</h4>
                            <p>{`Length: ${quotation.length}cm, Width: ${quotation.width}cm, Height: ${quotation.height}cm`}</p>
                        </div>
                        {quotation.features && quotation.features.length > 0 && (
                            <div>
                                <h4 className="font-semibold">Features</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {quotation.features.map(f => <Badge key={f} variant="secondary">{getFeatureName(f)}</Badge>)}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
                
                <Card className="bg-primary/10 border-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <DollarSign /> Final Price
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-primary">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(quotation.finalPrice)}
                        </p>
                         <p className="text-sm text-muted-foreground mt-1">
                            (Estimated Cost: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(quotation.estimatedCost)})
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}


export default function SharedQuotationPage() {
    return (
      <div className="flex flex-col min-h-dvh bg-background text-foreground">
        <Header title="Quotation" />
        <main className="flex-1">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin"/></div>}>
                <QuotationDisplay />
            </Suspense>
        </main>
      </div>
    );
  }
