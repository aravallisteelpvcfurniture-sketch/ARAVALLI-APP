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
  themeColor: '#16A34A',
  other: {
    "google-site-verification": "tLL_35h2I3fC5p2w-p0wK1aL8_4Oq2r_2s5X0jE",
  },
  icons: {
    icon: 'https://i.ibb.co/WpcLSqZd/images-Aspose-Words-38de3690-d30c-4f18-b0a7-9daaa920662f-001.png',
    shortcut: 'https://i.ibb.co/WpcLSqZd/images-Aspose-Words-38de3690-d30c-4f18-b0a7-9daaa920662f-001.png',
    apple: 'https://i.ibb.co/WpcLSqZd/images-Aspose-Words-38de3690-d30c-4f18-b0a7-9daaa920662f-001.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#16A34A',
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
