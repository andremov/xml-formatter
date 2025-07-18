import XMLFormatter from "~/_components/xml-formatter";
import LocaleSwitcher from "~/_components/locale-switcher";

export default function HomePage() {
  return (
    <main className="h-screen max-h-screen bg-white pb-4 pt-16 transition-colors dark:bg-gray-900">
      <LocaleSwitcher />
      <XMLFormatter />
    </main>
  );
}
