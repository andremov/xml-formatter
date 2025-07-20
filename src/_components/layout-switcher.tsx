import { Columns2, Rows2Icon } from "lucide-react";
import clsx from "clsx";

export default function LayoutSwitcher({
  showColumns,
  setShowColumns,
}: {
  showColumns: boolean;
  setShowColumns: (value: boolean) => void;
}) {
  return (
    <div className="hidden w-fit overflow-hidden rounded-md border border-gray-600 bg-gray-800 md:flex">
      <button
        className={clsx([
          "px-3 py-1 text-gray-100 transition-colors hover:bg-gray-700",
          {
            "bg-gray-600": showColumns,
            "opacity-50 hover:opacity-75": !showColumns,
          },
        ])}
        onClick={() => setShowColumns(true)}
      >
        <Columns2 />
      </button>

      <button
        className={clsx([
          "px-3 py-1 text-gray-100 transition-colors hover:bg-gray-700",
          {
            "bg-gray-600": !showColumns,
            "opacity-50 hover:opacity-75": showColumns,
          },
        ])}
        onClick={() => setShowColumns(false)}
      >
        <Rows2Icon />
      </button>
    </div>
  );
}
