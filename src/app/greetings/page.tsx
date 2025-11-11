import fs from 'fs';
import path from 'path';
import { GreetingsClientPage, ImagePlaceholder } from '@/components/greetings-client-page';

export default function GreetingsPage() {
  let posterImages: ImagePlaceholder[] = [];
  const posterDirectory = path.join(process.cwd(), 'public/poster');

  try {
    // Check if directory exists before trying to read it
    if (fs.existsSync(posterDirectory)) {
      const filenames = fs.readdirSync(posterDirectory);
      posterImages = filenames
        .filter(name => /\.(jpg|jpeg|png)$/i.test(name))
        .map((name, index) => ({
          id: `poster-${index}`,
          description: name,
          imageUrl: `/poster/${name}`, // Use relative path for the browser
          imageHint: 'festival poster',
        }));
    }
  } catch (error) {
    console.error("Could not read poster directory:", error);
    // If there's an error (e.g., permissions), posterImages will remain an empty array.
  }

  return <GreetingsClientPage images={posterImages} />;
}
