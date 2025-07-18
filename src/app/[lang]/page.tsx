"use client";

import XMLFormatter from "~/_components/xml-formatter";
import LocaleSwitcher from "~/_components/locale-switcher";

type PageProps = {
  params: { lang: "en" | "es" };
};

export default function HomePage({ params }: PageProps) {
  return (
    <main className="h-screen max-h-screen bg-white pb-4 pt-16 transition-colors dark:bg-gray-900">
      <LocaleSwitcher lang={params.lang} />
      <XMLFormatter lang={params.lang} />
    </main>
  );
}
