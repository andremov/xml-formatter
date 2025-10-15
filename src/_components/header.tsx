import { LogoIcon } from "./logo-icon";
import LocaleSwitcher from "./locale-switcher";

export function Header({ title }: { title: string }) {
  return (
    <div className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <LogoIcon className="size-10 rotate-12 text-white" />
            <LocaleSwitcher />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{title}</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
