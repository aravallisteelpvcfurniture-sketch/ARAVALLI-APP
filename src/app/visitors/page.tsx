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
    { label: 'Created', count: 1, color: 'bg-yellow-400' },
    { label: 'Assigned', count: 1, color: 'bg-orange-500' },
    { label: 'Requirement Gathered', count: 1, color: 'bg-blue-500' },
    { label: 'Estimate', count: 1, color: 'bg-cyan-500' },
    { label: 'Quotation Shared', count: 1, color: 'bg-green-500' },
    { label: 'Follow up', count: 1, color: 'bg-indigo-500' },
    { label: 'Converted', count: 1, color: 'bg-purple-600' },
    { label: 'Closed', count: 1, color: 'bg-pink-600' },
];

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.21 13.66a5.46 5.46 0 0 1-7.72 0 5.46 5.46 0 0 1 0-7.72 5.46 5.46 0 0 1 7.72 0 5.46 5.46 0 0 1 0 7.72z" opacity=".1"/>
        <path d="M16.6 14.21a1 1 0 0 0-1.35-.35l-1.3 1.08a.69.69 0 0 1-.72 0l-2.73-2.05a.69.69 0 0 1-.3-1L11.55 9.8a1 1 0 0 0-.42-1.36l-1.5-1a1 1 0 0 0-1.4.3L7.17 9.1a.69.69 0 0 0 0 .72l2.4 3.21a.69.69 0 0 0 .72 0l2.74-2.05a.69.69 0 0 0 .3-1l-1.34-2.24a1 1 0 0 0-1.35-.42L8.9 9.17" />
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
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
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-between text-left font-normal h-12 rounded-xl",
                                    !dateTo && "text-muted-foreground"
                                )}
                                >
                                {dateTo ? format(dateTo, "dd-MM-yyyy") : <span>To</span>}
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex w-max space-x-2 pb-2">
                        {statusFilters.map(filter => (
                            <Button key={filter.label} variant="secondary" className={`h-auto flex-col gap-0 p-2 rounded-xl text-white hover:text-white/90 ${filter.color} hover:bg-opacity-90`} style={{backgroundColor: filter.color}}>
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
                            <Card key={visitor.id} className="rounded-2xl shadow-md overflow-hidden">
                                 {visitor.status && (
                                     <div className={cn("text-white text-xs font-bold px-3 py-1 text-center",
                                        visitor.status === 'Hot' && 'bg-red-500',
                                        visitor.status === 'Warm' && 'bg-yellow-500',
                                        visitor.status === 'Cold' && 'bg-blue-500',
                                        !['Hot', 'Warm', 'Cold'].includes(visitor.status) && 'bg-gray-500'
                                     )}>
                                        {visitor.status}
                                    </div>
                                 )}
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                        <Link href={`/visitors/${visitor.id}`} className="block flex-1">
                                            <h3 className="font-bold text-lg">{visitor.name}</h3>
                                            <p className="text-muted-foreground text-sm">{visitor.phone}</p>
                                            <p className="text-muted-foreground text-sm truncate">{visitor.email}</p>
                                        </Link>
                                        <div className="flex items-center gap-2 ml-4">
                                            <a href={`tel:${visitor.phone}`} className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                   <Phone className="h-5 w-5" />
                                                </div>
                                            </a>
                                            <a href={`https://wa.me/${visitor.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                                                 <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                    <WhatsAppIcon className="h-6 w-6"/>
                                                 </div>
                                            </a>
                                        </div>
                                    </div>
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
