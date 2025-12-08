'use client';

import React from 'react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Phone, Bell, Calendar as CalendarIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Visitor } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const statusFilters = [
    { label: 'Created', count: 0, color: 'bg-yellow-400' },
    { label: 'Assigned', count: 0, color: 'bg-red-600' },
    { label: 'Requirement Gathered', count: 0, color: 'bg-green-700' },
    { label: 'Estimate', count: 1, color: 'bg-cyan-500' },
    { label: 'Quotation Shared', count: 1, color: 'bg-green-500' },
    { label: 'Follow up', count: 1, color: 'bg-indigo-500' },
    { label: 'Converted', count: 1, color: 'bg-purple-600' },
    { label: 'Closed', count: 1, color: 'bg-pink-600' },
];

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.75 13.96c-.25-.12-1.47-.72-1.7-.8-.22-.08-.39-.12-.55.12-.16.25-.64.8-.79.96-.15.16-.3.18-.55.06-.25-.12-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.15-.25-.02-.38.1-.5.11-.11.25-.28.37-.42.12-.14.16-.25.25-.41.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.82-.2-.48-.4-.42-.55-.42-.15,0-.3,0-.45,0-.15,0-.39.06-.6.3-.2.25-.78.76-.78,1.88,0,1.11.8,2.18.91,2.33.12.15,1.58,2.4,3.82,3.36.55.24.97.38,1.31.48.55.16,1.05.14,1.44.09.44-.06,1.47-.6,1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
    </svg>
);


export default function VisitorsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const [dateFrom, setDateFrom] = React.useState<Date>();
    const [dateTo, setDateTo] = React.useState<Date>();

    const visitorsCollectionRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'visitors');
    }, [firestore, user?.uid]);

    const { data: visitors, isLoading } = useCollection<Visitor>(visitorsCollectionRef);

    return (
        <div className="flex flex-col min-h-dvh bg-muted">
            <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 flex items-center justify-between">
                <div className='flex items-center gap-4'>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Button>
                    <h1 className="text-xl font-bold">Visitor List</h1>
                </div>
                <Bell className="h-6 w-6" />
            </header>

            <main className="flex-1 flex flex-col p-4 gap-4">
                <div>
                    <span className="text-sm font-medium text-muted-foreground">Select Date From</span>
                    <div className="grid grid-cols-2 items-center gap-4 mt-1">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-between text-left font-normal h-12 rounded-xl",
                                    !dateFrom && "text-muted-foreground"
                                )}
                                >
                                {dateFrom ? format(dateFrom, "dd-MM-yyyy") : <span>Select date</span>}
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                            </PopoverContent>
                        </Popover>
                         <div className="flex items-center gap-2">
                             <span className="text-sm text-muted-foreground">To</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-between text-left font-normal h-12 rounded-xl",
                                        !dateTo && "text-muted-foreground"
                                    )}
                                    >
                                    {dateTo ? format(dateTo, "dd-MM-yyyy") : <span>Select date</span>}
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex w-max space-x-2 pb-2">
                        {statusFilters.map(filter => (
                            <Button key={filter.label} variant="secondary" className={`h-auto flex-col gap-0 p-2 rounded-xl text-white hover:text-white/90`} style={{backgroundColor: filter.color}}>
                                <span className="font-semibold text-sm">{filter.label}</span>
                                <span className="font-bold text-lg">#{filter.count}</span>
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>


                {isLoading && (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="rounded-2xl">
                                <CardContent className="p-4 space-y-3">
                                    <Skeleton className="h-6 w-1/2" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!isLoading && visitors && visitors.length > 0 && (
                    <div className="space-y-4">
                        {visitors.map((visitor) => (
                            <Card key={visitor.id} className="rounded-2xl shadow-md overflow-hidden relative">
                                 {visitor.status && (
                                     <div className={cn("absolute top-2 right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10",
                                        visitor.status === 'Hot' && 'bg-red-500',
                                        visitor.status === 'Warm' && 'bg-yellow-500',
                                        visitor.status === 'Cold' && 'bg-blue-500',
                                        !['Hot', 'Warm', 'Cold'].includes(visitor.status) && 'bg-green-500'
                                     )}>
                                        {visitor.status === 'Quotation' ? 'Estimate Shared' : visitor.status}
                                    </div>
                                 )}
                                <CardContent className="p-4">
                                    <Link href={`/visitors/${visitor.id}`} className="block">
                                        <h3 className="font-bold text-xl mb-1">{visitor.name}</h3>
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                            <span>{visitor.phone}</span>
                                            <div className="flex items-center gap-2">
                                                <a href={`tel:${visitor.phone}`} onClick={e => e.stopPropagation()} className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors">
                                                    <Phone className="h-4 w-4" />
                                                </a>
                                                <a href={`https://wa.me/${visitor.phone.replace(/[^0-9]/g, '')}`} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors">
                                                    <WhatsAppIcon className="h-5 w-5"/>
                                                </a>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-sm truncate mt-1">{visitor.email}</p>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!isLoading && (!visitors || visitors.length === 0) && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg bg-background">
                        <p className="text-lg font-semibold">No Visitors Yet</p>
                        <p className="text-sm">Click "Add Visitor" to get started.</p>
                    </div>
                )}
            </main>
            <footer className="sticky bottom-0 p-4 bg-transparent backdrop-blur-sm">
                 <Button asChild size="lg" className="w-full h-14 rounded-full text-lg">
                    <Link href="/visitors/add">
                        <Plus className="mr-2 h-5 w-5" />
                        Add Visitor
                    </Link>
                </Button>
            </footer>
        </div>
    );
}
