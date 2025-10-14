"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
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

// XML Folding Component
interface XMLNodeProps {
  content: string;
  depth: number;
}

function XMLNode({ content, depth }: XMLNodeProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check if this content represents a foldable XML element
  const lines = content.split("\n");
  const firstLine = lines[0]?.trim() ?? "";
  const lastLine = lines[lines.length - 1]?.trim() ?? "";

  // Check if it's an opening tag followed by content and a closing tag
  const openTagRegex = /^<([^\/\s>]+)(\s[^>]*)?>(.*)$/;
  const openTagMatch = openTagRegex.exec(firstLine);
  const closingTagRegex = /^<\/[^>]+>$/;
  const hasClosingTag =
    closingTagRegex.exec(lastLine) ?? openTagMatch?.[3]?.includes("</");

  // Only make it foldable if it's a multi-line element with opening and closing tags
  const isFoldable =
    lines.length > 1 &&
    openTagMatch &&
    hasClosingTag &&
    !firstLine.includes("/>");

  if (!isFoldable) {
    return <div className="my-1 ml-5 leading-5">{content}</div>;
  }

  const tagName = openTagMatch[1];
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  if (isCollapsed) {
    return (
      <div className="my-1 flex pl-1">
        <div className="ml-5 flex-1">
          <div className="relative flex items-center leading-5">
            <button
              onClick={toggleCollapse}
              className="absolute -left-5 text-gray-400 transition-colors hover:text-white"
              aria-label="Expand"
            >
              <ChevronRight className="size-4" />
            </button>
            <span>{`<${tagName}>`}</span>
            <span>...</span>
            <div className="leading-5">{`</${tagName}>`}</div>
          </div>
        </div>
      </div>
    );
  }

  // When expanded, we need to parse the inner content for nested foldable elements
  const innerContent = lines.slice(1, -1).join("\n");
  const openingTag = lines[0];
  const closingTag = lines[lines.length - 1];

  return (
    <div className="my-1 flex overflow-hidden rounded-xl border-l border-dashed border-gray-600 pl-1">
      <div className="ml-5 flex-1">
        <div className="relative flex items-center leading-5">
          <button
            onClick={toggleCollapse}
            className="absolute -left-5 text-gray-400 transition-colors hover:text-white"
            aria-label="Collapse"
          >
            <ChevronDown className="size-4" />
          </button>
          <span>{openingTag}</span>
        </div>
        {innerContent && <FoldableXMLOutput content={innerContent} />}
        <div className="leading-5">{closingTag}</div>
      </div>
    </div>
  );
}

function FoldableXMLOutput({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: Array<{ content: string; depth: number }> = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i++;
      continue;
    }

    const trimmedLine = line.trim();
    const indentLevel = Math.floor((line.length - line.trimStart().length) / 2);

    // Check for opening tag that's not self-closing
    const openTagRegex = /^<([^\/\s>!?]+)(\s[^>]*)?>(.*)$/;
    const openTagMatch = openTagRegex.exec(trimmedLine);

    if (
      openTagMatch &&
      !trimmedLine.includes("/>") &&
      !trimmedLine.includes("<?") &&
      !trimmedLine.includes("<!--")
    ) {
      const tagName = openTagMatch[1];
      const afterTag = openTagMatch[3] ?? "";

      // Check if it's a self-contained line (opening and closing tag on same line)
      if (afterTag.includes(`</${tagName}>`)) {
        elements.push({ content: line, depth: indentLevel });
        i++;
        continue;
      }

      // This is a multi-line element, find its closing tag
      let j = i + 1;
      let elementDepth = 1;

      while (j < lines.length && elementDepth > 0) {
        const nextLine = lines[j];
        if (!nextLine) {
          j++;
          continue;
        }

        const nextTrimmed = nextLine.trim();

        // Count opening and closing tags for this specific tag
        const openRegex = new RegExp(`<${tagName}(\\s|>)`, "g");
        const closeRegex = new RegExp(`</${tagName}>`, "g");
        const openCount = (nextTrimmed.match(openRegex) ?? []).length;
        const closeCount = (nextTrimmed.match(closeRegex) ?? []).length;

        elementDepth += openCount - closeCount;

        if (elementDepth === 0) {
          // Found the closing tag, create element
          const elementContent = lines.slice(i, j + 1).join("\n");
          elements.push({ content: elementContent, depth: indentLevel });
          i = j + 1;
          break;
        }
        j++;
      }

      if (elementDepth > 0) {
        // No closing tag found, treat as single line
        elements.push({ content: line, depth: indentLevel });
        i++;
      }
    } else {
      // Regular line or self-closing tag
      elements.push({ content: line, depth: indentLevel });
      i++;
    }
  }

  return elements.map((element, index) => (
    <XMLNode key={index} content={element.content} depth={element.depth} />
  ));
}

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
            className="w-full flex-1 resize-none rounded-md border border-gray-600 bg-gray-800 p-4 font-mono text-white placeholder-gray-400 outline-none transition focus:border-blue-500"
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
          <div
            className={clsx([
              "flex-1 overflow-x-hidden text-wrap break-words rounded-md bg-gray-800 px-6 py-4 font-mono text-gray-100",
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
              <FoldableXMLOutput content={output} />
            )}
          </div>
        </TextArea>
      </div>
    </div>
  );
}
