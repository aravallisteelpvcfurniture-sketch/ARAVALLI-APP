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
    // You can decide how to handle the error, maybe show a message
    return (
        <div className="flex flex-col min-h-dvh bg-background text-foreground">
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Error</h1>
                    <p className="text-muted-foreground">Could not load greeting images. Make sure the 'public/poster' directory exists.</p>
                </div>
            </main>
        </div>
    );
  }

  return <GreetingsClientPage images={posterImages} />;
}
