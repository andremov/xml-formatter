import Link from "next/link";

export default function LocaleSwitcher({
  lang = "en",
}: {
  lang?: "en" | "es";
}) {
  return (
    <div className="absolute left-1/2 top-5 flex -translate-x-1/2 rounded-md border border-gray-200">
      <Link
        href={"/en"}
        className={
          (lang === "en" ? "bg-gray-200 font-semibold" : "") + " px-3 py-1"
        }
      >
        EN
      </Link>

      <Link
        href={"/es"}
        className={
          (lang === "es" ? "bg-gray-200 font-semibold" : "") + " px-3 py-1"
        }
      >
        ES
      </Link>
    </div>
  );
}
