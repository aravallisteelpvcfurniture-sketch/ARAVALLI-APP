'use client';

import { Configurator } from "@/components/configurator";
import { Button } from "@/components/ui/button";
import { Bell, ChevronLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function QuotationContent() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { visitorId } = params as { visitorId: string };

    const initialDimensions = {
        length: searchParams.has('length') ? Number(searchParams.get('length')) : undefined,
        width: searchParams.has('width') ? Number(searchParams.get('width')) : undefined,
        height: searchParams.has('height') ? Number(searchParams.get('height')) : undefined,
    };

    return (
        <div className="flex flex-col min-h-dvh bg-muted text-foreground">
             <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-bold">Quotation</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                <Configurator 
                    visitorId={visitorId} 
                    initialDimensions={initialDimensions}
                />
            </main>
        </div>
    )
}


export default function QuotationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QuotationContent />
        </Suspense>
    )
}
