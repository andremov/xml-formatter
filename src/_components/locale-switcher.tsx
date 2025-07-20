import Link from "next/link";

export default function LocaleSwitcher({
  lang = "en",
}: {
  lang?: "en" | "es";
}) {
  return (
    <div className="flex overflow-hidden rounded-md border border-gray-600 bg-gray-800">
      <Link
        href={"/en"}
        className={
          (lang === "en" ? "bg-gray-600 font-semibold" : "") +
          " px-3 py-1 text-gray-100 transition-colors hover:bg-gray-700"
        }
      >
        EN
      </Link>

      <Link
        href={"/es"}
        className={
          (lang === "es" ? "bg-gray-600 font-semibold" : "") +
          " px-3 py-1 text-gray-100 transition-colors hover:bg-gray-700"
        }
      >
        ES
      </Link>
    </div>
  );
}
