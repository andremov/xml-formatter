import locale from "~/utils/locale.json";
import type LocaleStrings from "~/utils/types";
import { Columns2, Rows2Icon } from "lucide-react";
import clsx from "clsx";

type HeaderPropsType = {
  showColumns: boolean;
  setShowColumns: (value: boolean) => void;
  lang?: "en" | "es";
};

export default function Header(props: HeaderPropsType) {
  const { showColumns, setShowColumns, lang = "en" } = props;
  const localeStrings = locale[lang] as LocaleStrings;

  return (
    <div className="relative mx-auto flex w-full max-w-screen-md items-center justify-center">
      <h1 className="mb-4 text-center text-2xl font-bold">
        {localeStrings.title}
      </h1>

      <div className="absolute right-0 top-0 flex w-fit rounded-md border border-gray-200">
        <button
          className={clsx([
            "px-2 py-1",
            {
              "bg-gray-200": showColumns,
              "opacity-50": !showColumns,
            },
          ])}
          onClick={() => setShowColumns(true)}
        >
          <Columns2 />
        </button>

        <button
          className={clsx([
            "px-2 py-1",
            {
              "bg-gray-200": !showColumns,
              "opacity-50": showColumns,
            },
          ])}
          onClick={() => setShowColumns(false)}
        >
          <Rows2Icon />
        </button>
      </div>
    </div>
  );
}
