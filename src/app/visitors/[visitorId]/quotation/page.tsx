'use client';

import { Configurator } from "@/components/configurator";
import { Button } from "@/components/ui/button";
import { Bell, ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function QuotationPage() {
    const router = useRouter();
    const params = useParams();
    const { visitorId } = params as { visitorId: string };

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
                <Configurator visitorId={visitorId} />
            </main>
        </div>
    )
}
