"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { AlertCircle, Check, Copy } from "lucide-react";
import locale from "~/utils/locale.json";
import xmlFormatter from "xml-formatter";
import type LocaleStrings from "~/utils/types";
import clsx from "clsx";
import Header from "./header";

const debounce = (func: (arg: string) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (arg: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(arg), delay);
  };
};

export default function XMLFormatter({ lang = "en" }: { lang?: "en" | "es" }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [showColumns, setShowColumns] = useState(true);
  const localeStrings = locale[lang] as LocaleStrings;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formatXML = useCallback(
    debounce((value: string) => {
      if (!value.trim()) {
        setOutput("");
        setError("");
        return;
      }

      try {
        const formatted = xmlFormatter(value, {
          indentation: "  ",
          collapseContent: true,
          lineSeparator: "\n",
        });
        setOutput(formatted);
        setError("");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError(localeStrings.error_body);
        setOutput("");
      }
    }, 300),
    [],
  );

  useEffect(() => {
    formatXML(input);
  }, [input, formatXML]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="container mx-auto flex h-full flex-col">
      <Header
        setShowColumns={setShowColumns}
        lang={lang}
        showColumns={showColumns}
      />

      <div
        className={clsx([
          "flex flex-1 gap-4",
          {
            "flex-row": showColumns,
            "flex-col": !showColumns,
          },
        ])}
      >
        <div
          className={clsx([
            "flex flex-col gap-2",
            {
              "w-1/2": showColumns,
              "flex-1": !showColumns,
            },
          ])}
        >
          <h2 className="h-10 text-lg font-semibold">
            {localeStrings.labels.input}
          </h2>
          <textarea
            placeholder={localeStrings.labels.data}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full flex-1 resize-none rounded-md border border-gray-200 p-4 outline-none transition focus:border-blue-400"
          />
        </div>

        <div
          className={clsx([
            "flex flex-col gap-2",
            {
              "w-1/2": showColumns,
            },
          ])}
        >
          <div className="flex h-10 items-center justify-between">
            <h2 className="text-lg font-semibold">
              {localeStrings.labels.output}
            </h2>
            {output && (
              <button
                onClick={handleCopy}
                className={clsx([
                  "flex items-center gap-2 rounded-md border border-gray-200 px-2 py-1 outline-none transition hover:bg-gray-200",
                  {
                    "bg-green-600 text-white": isCopied,
                  },
                ])}
              >
                {isCopied ? (
                  <Fragment>
                    <Check className="h-4 w-4" />
                    <span>{localeStrings.buttons.copied}</span>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Copy className="h-4 w-4" />
                    <span>{localeStrings.buttons.copy}</span>
                  </Fragment>
                )}
              </button>
            )}
          </div>

          <pre
            className={clsx([
              "flex-1 rounded-md bg-gray-200 p-4",
              {
                "whitespace-pre-wrap text-red-400": !!error,
                "overflow-auto": !error,
                "max-h-[81.4vh]": showColumns,
                "max-h-[40.7vh]": !showColumns,
              },
            ])}
          >
            {error ? (
              <>
                <div className="mb-4 flex items-center gap-6">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-bold">{localeStrings.error}</span>
                </div>
                <span>{error}</span>
              </>
            ) : (
              output
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
