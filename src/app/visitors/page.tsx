'use client';

import React from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const parties = [
  { id: 1, name: 'Ashok Kumar' },
  { id: 2, name: 'Sunita Devi' },
  { id: 3, name: 'Rajesh Sharma' },
  { id: 4, name: 'Priya Singh' },
  { id: 5, name: 'Amit Patel' },
];

export default function VisitorsPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header title="Visitors" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Party List</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Party
          </Button>
        </div>
        
        <div className="space-y-4">
          {parties.map((party) => (
            <Card key={party.id} className="rounded-2xl">
              <CardContent className="p-0">
                <Link href="#" className="flex items-center justify-between p-4 group">
                  <span className="font-medium">{party.name}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
