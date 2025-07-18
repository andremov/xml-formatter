import Link from "next/link";

export default function LocaleSwitcher({
  lang = "en",
}: {
  lang?: "en" | "es";
}) {
  return (
    <div className="absolute left-1/2 top-5 flex -translate-x-1/2 rounded-md border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
      <Link
        href={"/en"}
        className={
          (lang === "en" ? "bg-gray-200 font-semibold dark:bg-gray-600" : "") +
          " px-3 py-1 text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
        }
      >
        EN
      </Link>

      <Link
        href={"/es"}
        className={
          (lang === "es" ? "bg-gray-200 font-semibold dark:bg-gray-600" : "") +
          " px-3 py-1 text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
        }
      >
        ES
      </Link>
    </div>
  );
}
