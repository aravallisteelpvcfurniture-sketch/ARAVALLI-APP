'use client';

import { Configurator } from "@/components/configurator";
import { Button } from "@/components/ui/button";
import { Bell, ChevronLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";

function QuotationContent() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { visitorId } = params as { visitorId: string };

    const initialDimensions = {
        length: undefined, // Length is no longer used from measurement
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
                    <h1 className="text-xl font-bold">Create Quotation</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                <div className="relative h-64 w-full">
                    <Image
                        src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=2160&auto=format&fit=crop"
                        alt="Modern furniture"
                        layout="fill"
                        objectFit="cover"
                        className="opacity-90"
                        data-ai-hint="modern furniture"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-muted to-transparent" />
                </div>
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

    