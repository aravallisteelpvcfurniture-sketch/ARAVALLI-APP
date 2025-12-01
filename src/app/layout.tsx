import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';
import ThemeColorSetter from '@/components/theme-color-setter';

export const metadata: Metadata = {
  title: 'Aravalli Configurator',
  description: 'Customize and order your steel and PVC furniture.',
  applicationName: 'Aravalli Configurator',
  authors: [{ name: 'Aravalli Steel' }],
  keywords: ['furniture', 'configurator', 'steel', 'pvc', 'custom'],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00BFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#00BFFF' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeColorSetter />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
