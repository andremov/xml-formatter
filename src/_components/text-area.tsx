import clsx from "clsx";
import { Check, Copy, ChevronUp } from "lucide-react";
import { Fragment, type MouseEvent, useState } from "react";

export function TextArea({
  title,
  value,
  children,
  showColumns,
  copyActionLabel = "Copy",
  copiedActionLabel = "Copied",
  minimizeLabel = "Minimize",
  expandLabel = "Expand",
}: {
  title: string;
  value: string;
  children: React.ReactNode;
  showColumns?: boolean;
  copyActionLabel?: string;
  copiedActionLabel?: string;
  minimizeLabel?: string;
  expandLabel?: string;
}) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      className={clsx([
        "flex min-h-12 flex-col gap-2 overflow-hidden transition-all duration-300 ease-in-out",
        {
          "lg:w-1/2": showColumns,
          "flex-1": !isMinimized,
          "h-auto w-auto": isMinimized,
        },
      ])}
    >
      <div className="flex h-10 items-center justify-between bg-gray-700 px-2 md:rounded-md">
        <div
          className={clsx([
            "flex items-center gap-2",
            {
              "md:pointer-events-none": showColumns,
            },
          ])}
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div
            className="flex items-center justify-center rounded-md border border-gray-500 bg-gray-600 p-1 outline-none transition hover:bg-gray-500"
            title={isMinimized ? expandLabel : minimizeLabel}
          >
            <ChevronUp
              className={clsx([
                "h-4 w-4 text-white transition-transform duration-300 ease-in-out",
                {
                  "rotate-180": isMinimized,
                  "rotate-0": !isMinimized,
                  "md:hidden": showColumns,
                },
              ])}
            />
          </div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <div className="transition-all duration-300 ease-in-out">
          {value && (
            <button
              onClick={handleCopy}
              className={clsx([
                "flex items-center gap-2 rounded-md border border-gray-500 bg-gray-600 px-2 py-1 text-white outline-none transition hover:bg-gray-500",
                {
                  "bg-green-600 text-white hover:bg-green-500": isCopied,
                },
              ])}
            >
              {isCopied ? (
                <Fragment>
                  <Check className="h-4 w-4" />
                  <span>{copiedActionLabel}</span>
                </Fragment>
              ) : (
                <Fragment>
                  <Copy className="h-4 w-4" />
                  <span>{copyActionLabel}</span>
                </Fragment>
              )}
            </button>
          )}
        </div>
      </div>

      <div
        className={clsx([
          "flex min-h-0 flex-1 overflow-hidden px-1 transition-all duration-300 ease-in-out",
          {
            "max-h-0 opacity-0": isMinimized,
            "md:max-h-full md:opacity-100": showColumns,
            "opacity-100": !isMinimized,
          },
        ])}
      >
        {children}
      </div>
    </div>
  );
}
