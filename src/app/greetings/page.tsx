'use client';

import { GreetingsClientPage } from '@/components/greetings-client-page';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

// Hardcoded image data to ensure it loads without any external file dependency issues.
const hardcodedImages: ImagePlaceholder[] = [
  {
    id: "diwali-poster",
    description: "A festive poster for Diwali.",
    imageUrl: "/Diwali.png", // This points to public/Diwali.png
    imageHint: "Diwali festival"
  }
];


export default function GreetingsPage() {
  // Using the hardcoded image data directly to bypass any potential import problems.
  return <GreetingsClientPage images={hardcodedImages} />;
}
