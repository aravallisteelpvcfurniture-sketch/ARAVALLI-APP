'use client';

import React from 'react';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Card, CardContent } from './ui/card';

const carouselImages = [
  {
    src: 'https://i.ibb.co/vxQWBCbr/10321192.jpg',
    alt: 'Beautiful festive background',
    'data-ai-hint': 'festive background'
  },
  {
    src: 'https://i.ibb.co/hKxSPYp/gettyimages-1201199341-612x612.jpg',
    alt: 'Beautiful festive background',
    'data-ai-hint': 'festive background'
  },
  {
    src: 'https://i.ibb.co/gJF2YfW/360-F-473254957-bx-G9-So-Fvk-O5-KISs-L-G9-Ua-I-Vf-Cnd-My-Pa-R.jpg',
    alt: 'Beautiful festive background',
    'data-ai-hint': 'festive background'
  },
  {
    src: 'https://picsum.photos/seed/carousel1/1200/900',
    alt: 'Promotional banner for furniture',
    'data-ai-hint': 'furniture sale'
  },
  {
    src: 'https://picsum.photos/seed/carousel2/1200/900',
    alt: 'Modern interior design',
    'data-ai-hint': 'modern interior'
  },
  {
    src: 'https://picsum.photos/seed/carousel3/1200/900',
    alt: 'Custom steel furniture',
    'data-ai-hint': 'steel furniture'
  },
];

export function DashboardCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {carouselImages.map((image, index) => (
          <CarouselItem key={index}>
            <Card className="overflow-hidden rounded-2xl">
              <CardContent className="p-0">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={900}
                  className="w-full aspect-[4/3] object-cover"
                  data-ai-hint={image['data-ai-hint']}
                  priority={index === 0}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
