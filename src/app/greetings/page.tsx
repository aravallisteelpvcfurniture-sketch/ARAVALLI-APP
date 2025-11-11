'use client';

import { GreetingsClientPage } from '@/components/greetings-client-page';
import data from '@/lib/placeholder-images.json';

// The page is now a client component again.
export default function GreetingsPage() {
  // We directly use the imported JSON data.
  const posterImages = data.placeholderImages;

  return <GreetingsClientPage images={posterImages} />;
}
