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
    src: 'https://i.ibb.co/ymNknXtf/Aravalli-1.png',
    alt: 'Aravalli furniture design',
    'data-ai-hint': 'furniture design'
  },
  {
    src: 'https://i.ibb.co/WWKXqK0x/image-17140447488244.jpg',
    alt: 'Modern interior railing',
    'data-ai-hint': 'modern railing'
  },
  {
    src: 'https://i.ibb.co/zWH2HRz7/1000-F-1457835281-2-Jeg-Zczfrmp-Z8-Xb2-H0kv-Yo-Kipf-Jgryzb.jpg',
    alt: 'Steel staircase design',
    'data-ai-hint': 'steel staircase'
  },
  {
    src: 'https://i.ibb.co/Kx9G6tVM/best-design-railing-in-india-buy-railing-fitting.jpg',
    alt: 'Railing design India',
    'data-ai-hint': 'railing design'
  },
  {
    src: 'https://i.ibb.co/dsms6v7f/staircase-baluster-railing-steel-balustrade-design-balustrade-railing-500x500.jpg',
    alt: 'Steel balustrade design',
    'data-ai-hint': 'steel balustrade'
  }
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
