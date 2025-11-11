'use client';

import { GreetingsClientPage } from '@/components/greetings-client-page';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function GreetingsPage() {
  // The list of images is now directly imported from the JSON file via placeholder-images.ts
  // This avoids server-side file system access and the errors it was causing.
  return <GreetingsClientPage images={PlaceHolderImages} />;
}
