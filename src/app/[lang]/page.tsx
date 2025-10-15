"use client";

import XMLFormatter from "~/_components/xml-formatter";
import LocaleSwitcher from "~/_components/locale-switcher";
import type LocaleStrings from "~/utils/types";
import locale from "~/utils/locale.json";
import { useParams } from "next/navigation";
import { Header } from "~/_components/header";
import { Footer } from "~/_components/footer";

export default function HomePage() {
  const { lang } = useParams<{ lang: "en" | "es" }>();
  const localeStrings = locale[lang] as LocaleStrings;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 flex flex-col justify-between">
      <Header title={localeStrings.title} />

      <XMLFormatter localeStrings={localeStrings} />

      <Footer
        owner={localeStrings.owner}
        author={localeStrings.author}
        description={localeStrings.description}
      />
    </div>
  );
}
