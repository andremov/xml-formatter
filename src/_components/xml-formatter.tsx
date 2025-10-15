"use client";

import { useState, useEffect, useCallback } from "react";
import xmlFormatter from "xml-formatter";
import type LocaleStrings from "~/utils/types";
import { InputTextArea } from "./input-text-area";
import { OutputTextArea } from "./output-text-area";

const debounce = (func: (arg: string) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (arg: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(arg), delay);
  };
};

export default function XMLFormatter({
  localeStrings,
}: {
  localeStrings: LocaleStrings;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const loadSampleData = async () => {
    const sample = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book id="1">
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <price currency="USD">12.99</price>
  </book>
  <book id="2">
    <title>1984</title>
    <author>George Orwell</author>
    <price currency="USD">9.99</price>
  </book>
</bookstore>`;
    setInput(sample);
  };

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
    []
  );

  useEffect(() => {
    formatXML(input);
  }, [input, formatXML]);

  return (
    <div className="w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-16rem)]">
        <InputTextArea
          title={localeStrings.labels.input}
          value={input}
          onChange={setInput}
          placeholder={localeStrings.labels.data}
          buttonLabels={localeStrings.buttons}
          onLoadSample={loadSampleData}
        />

        <OutputTextArea
          title={localeStrings.labels.output}
          value={output}
          error={error}
          errorTitle={localeStrings.error}
          errorBody={localeStrings.error_body}
          buttonLabels={localeStrings.buttons}
        />
      </div>
    </div>
  );
}
