import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "XML Formatter",
  description: "👤✏️ Andrés Movilla",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <body className="bg-white text-gray-900 transition-colors dark:bg-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
