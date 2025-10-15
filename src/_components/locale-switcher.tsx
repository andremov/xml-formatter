import Link from "next/link";
import { useParams } from "next/navigation";

export default function LocaleSwitcher() {
  const { lang } = useParams<{ lang: "en" | "es" }>();

  return (
    <div className="flex rounded-md border border-gray-500 p-1 gap-1">
      <Link
        href={"/en"}
        className={
          (lang === "en" ? "bg-gray-600 font-semibold" : "hover:bg-gray-700") +
          " px-4 py-1 text-gray-100 transition-colors rounded-sm text-sm"
        }
      >
        EN
      </Link>

      <Link
        href={"/es"}
        className={
          (lang === "es" ? "bg-gray-600 font-semibold" : "hover:bg-gray-700") +
          " px-4 py-1 text-gray-100 transition-colors rounded-sm text-sm"
        }
      >
        ES
      </Link>
    </div>
  );
}
