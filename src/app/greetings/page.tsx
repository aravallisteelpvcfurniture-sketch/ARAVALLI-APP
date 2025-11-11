import fs from 'fs';
import path from 'path';
import { GreetingsClientPage } from '@/components/greetings-client-page';

// This is now a Server Component to read files
export default function GreetingsPage() {
  const posterDirectory = path.join(process.cwd(), 'public', 'poster');
  let posterImages: { id: string; imageUrl: string; description: string; imageHint: string; }[] = [];

  try {
    const filenames = fs.readdirSync(posterDirectory);
    posterImages = filenames
      .filter(name => /\.(jpg|jpeg|png)$/i.test(name))
      .map((name, index) => ({
        id: `poster-${index}`,
        imageUrl: `/poster/${name}`, // URL path is relative to the public folder
        description: name.replace(/\.[^/.]+$/, ""), // Use filename as description
        imageHint: 'festival poster'
    }));
  } catch (error) {
    console.error("Could not read the poster directory:", error);
    // Gracefully handle the error if the directory doesn't exist
    // The client page will show a message.
  }

  return <GreetingsClientPage images={posterImages} />;
}
