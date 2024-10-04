import XMLFormatter from "~/_components/xml-formatter";
import LocaleSwitcher from "~/_components/locale-switcher";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <LocaleSwitcher />
      <XMLFormatter />
    </main>
  );
}
