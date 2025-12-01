import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Aravalli Configurator',
  description: 'Customize and order your steel and PVC furniture.',
  applicationName: 'Aravalli Configurator',
  authors: [{ name: 'Aravalli Steel' }],
  keywords: ['furniture', 'configurator', 'steel', 'pvc', 'custom'],
  themeColor: '#00BFFF',
  other: {
    "google-site-verification": "tLL_35h2I3fC5p2w-p0wK1aL8_4Oq2r_2s5X0jE",
  }
};

export const viewport: Viewport = {
  themeColor: '#00BFFF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
