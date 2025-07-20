"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import xmlFormatter from "xml-formatter";
import type LocaleStrings from "~/utils/types";
import clsx from "clsx";
import { TextArea } from "./text-area";

const debounce = (func: (arg: string) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (arg: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(arg), delay);
  };
};

export default function XMLFormatter({
  localeStrings,
  showColumns,
}: {
  localeStrings: LocaleStrings;
  showColumns: boolean;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

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

  return (
    <div className="container mx-auto flex h-full max-h-full flex-col overflow-hidden bg-gray-900 text-white">
      <div
        className={clsx([
          "flex flex-1 flex-col gap-1 overflow-hidden md:gap-2 lg:px-2",
          {
            "md:flex-row": showColumns,
            "md:flex-col": !showColumns,
          },
        ])}
      >
        <TextArea
          title={localeStrings.labels.input}
          value={input}
          showColumns={showColumns}
          copyActionLabel={localeStrings.buttons.copy}
          copiedActionLabel={localeStrings.buttons.copied}
          minimizeLabel={localeStrings.buttons.minimize}
          expandLabel={localeStrings.buttons.expand}
        >
          <textarea
            name="input"
            placeholder={localeStrings.labels.data}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full flex-1 resize-none rounded-md border border-gray-600 bg-gray-800 p-4 text-white placeholder-gray-400 outline-none transition focus:border-blue-500"
          />
        </TextArea>

        <TextArea
          title={localeStrings.labels.output}
          value={output}
          showColumns={showColumns}
          copyActionLabel={localeStrings.buttons.copy}
          copiedActionLabel={localeStrings.buttons.copied}
          minimizeLabel={localeStrings.buttons.minimize}
          expandLabel={localeStrings.buttons.expand}
        >
          <pre
            className={clsx([
              "flex-1 overflow-x-hidden text-wrap break-words rounded-md bg-gray-800 p-4 text-gray-100",
              {
                "whitespace-pre-wrap text-red-400": !!error,
                "overflow-auto": !error,
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
        </TextArea>
      </div>
    </div>
  );
}
