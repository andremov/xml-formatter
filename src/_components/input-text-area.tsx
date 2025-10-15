import { Check, Copy } from "lucide-react";
import { Fragment, type MouseEvent, useState } from "react";
import type LocaleStrings from "~/utils/types";

interface InputTextAreaProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  buttonLabels: LocaleStrings["buttons"];
  onLoadSample: () => void;
}

export function InputTextArea({
  title,
  value,
  onChange,
  placeholder,
  buttonLabels,
  onLoadSample,
}: InputTextAreaProps) {
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
    <div className="flex min-h-12 flex-col gap-2 rounded-lg ease-in-out flex-1 p-6 bg-gray-800 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onLoadSample}
            className="rounded-md bg-green-600 px-2 py-1 text-white outline-none transition hover:bg-green-500"
          >
            {buttonLabels.sample}
          </button>
          <button
            disabled={!value}
            onClick={handleCopy}
            className={`flex items-center gap-2 rounded-md bg-blue-600 px-2 py-1 text-white outline-none transition hover:bg-blue-500 ${
              isCopied ? "bg-green-600 text-white hover:bg-green-500" : ""
            }`}
          >
            {isCopied ? (
              <Fragment>
                <Check className="size-4" />
                <span>{buttonLabels.copied}</span>
              </Fragment>
            ) : (
              <Fragment>
                <Copy className="size-4" />
                <span>{buttonLabels.copy}</span>
              </Fragment>
            )}
          </button>
        </div>
      </div>

      <textarea
        name="input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full flex-1 resize-none rounded-md border border-gray-600 bg-gray-700 p-4 font-mono text-white placeholder-gray-400 outline-none transition focus:ring-blue-500 focus:ring-2"
      />
    </div>
  );
}
