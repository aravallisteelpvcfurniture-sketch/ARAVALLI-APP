'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/bottom-nav';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { useLoading } from '@/components/global-loader';

const pdfFiles = [
  { id: '1', title: 'Furniture Catalogue 2024', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: '2', title: 'Measurement Guide', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: '3', title: 'Terms and Conditions', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: '4', title: 'Warranty Information', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
];

export default function PdfViewerPage() {
  const router = useRouter();
  const { hideLoader } = useLoading();

  useEffect(() => {
    hideLoader();
  }, [hideLoader]);

  return (
    <div className="flex flex-col min-h-dvh bg-muted/40">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Documents</h1>
      </header>

      <main className="flex-1 p-4 space-y-3">
        {pdfFiles.map((pdf) => (
          <Link href={pdf.url} key={pdf.id} target="_blank" rel="noopener noreferrer" className="block">
            <Card className="hover:bg-muted transition-colors shadow-sm hover:shadow-md rounded-lg">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <p className="font-semibold">{pdf.title}</p>
                </div>
                <Download className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}
