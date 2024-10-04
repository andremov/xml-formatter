"use client";

import XMLFormatter from "~/_components/xml-formatter";
import LocaleSwitcher from "~/_components/locale-switcher";

type PageProps = {
  params: { lang: "en" | "es" };
};

export default function HomePage({ params }: PageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <LocaleSwitcher lang={params.lang} />
      <XMLFormatter lang={params.lang} />
    </main>
  );
}
