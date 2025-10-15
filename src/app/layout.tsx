import "./globals.css";

import { type Metadata, type Viewport } from "next";
import OfflineIndicator from "~/_components/offline-indicator";
import ServiceWorkerRegistration from "~/_components/service-worker-registration";

export const metadata: Metadata = {
  title: "XML Formatter",
  description: "Format and validate XML data - by Andrés Movilla",
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "apple-touch-icon", url: "/favicon.svg" },
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "XML Formatter",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "XML Formatter",
    title: "XML Formatter",
    description: "Format and validate XML data offline",
  },
  twitter: {
    card: "summary",
    title: "XML Formatter",
    description: "Format and validate XML data offline",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="XML Formatter" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#111827" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body>
        {/* <ServiceWorkerRegistration /> */}
        {/* <OfflineIndicator /> */}
        {children}
      </body>
    </html>
  );
}
