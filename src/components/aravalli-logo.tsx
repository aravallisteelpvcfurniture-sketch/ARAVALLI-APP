'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AravalliLogoProps {
  className?: string;
}

export function AravalliLogo({ className }: AravalliLogoProps) {
  return (
    <div className={cn('relative w-auto', className)}>
      <Image
        src="https://i.ibb.co/WpcLSqZd/images-Aspose-Words-38de3690-d30c-4f18-b0a7-9daaa920662f-001.png"
        alt="Aravalli Steel PVC Furniture Logo"
        width={200}
        height={50}
        priority
        className="h-full w-auto object-contain"
      />
    </div>
  );
}
