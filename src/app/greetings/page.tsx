'use client';

import { GreetingsClientPage } from '@/components/greetings-client-page';
import imageData from '@/lib/placeholder-images.json';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

export default function GreetingsPage() {
  const images: ImagePlaceholder[] = imageData.placeholderImages;
  return <GreetingsClientPage images={images} />;
}
