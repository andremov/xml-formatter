"use client";

import XMLFormatter from "~/_components/xml-formatter";
import LocaleSwitcher from "~/_components/locale-switcher";
import LayoutSwitcher from "../../_components/layout-switcher";
import { useState } from "react";
import type LocaleStrings from "~/utils/types";
import locale from "~/utils/locale.json";

type PageProps = {
  params: { lang: "en" | "es" };
};

export default function HomePage({ params }: PageProps) {
  const [showColumns, setShowColumns] = useState(true);
  const localeStrings = locale[params.lang] as LocaleStrings;

  return (
    <main className="flex h-screen max-h-screen flex-col py-4 md:mx-1">
      <div className="mb-4 flex w-full items-center justify-center gap-4">
        <h1 className="mr-10 text-center text-xl font-bold text-white md:text-2xl">
          {localeStrings.title}
        </h1>
        <LocaleSwitcher lang={params.lang} />
        <LayoutSwitcher
          setShowColumns={setShowColumns}
          showColumns={showColumns}
        />
      </div>
      <XMLFormatter localeStrings={localeStrings} showColumns={showColumns} />
    </main>
  );
}
