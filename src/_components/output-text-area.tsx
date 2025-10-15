import {
  Check,
  Copy,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Fragment, type MouseEvent, useState } from "react";
import type LocaleStrings from "~/utils/types";

// Import the FoldableXMLOutput component from xml-formatter
// We'll need to move this to a separate file or keep it here
interface XMLNodeProps {
  content: string;
}

function XMLNode({ content }: XMLNodeProps) {
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
    <XMLNode key={index} content={element.content} />
  ));
}

interface OutputTextAreaProps {
  title: string;
  value: string;
  error: string;
  errorTitle: string;
  errorBody: string;
  buttonLabels: LocaleStrings["buttons"];
}

export function OutputTextArea({
  title,
  value,
  error,
  errorTitle,
  errorBody,
  buttonLabels,
}: OutputTextAreaProps) {
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

      <div
        className={`flex-1 overflow-x-hidden text-wrap break-words rounded-md bg-gray-900 px-6 py-4 font-mono text-gray-100 border-gray-600 border ${
          error ? "whitespace-pre-wrap text-red-400" : "overflow-auto"
        }`}
      >
        {error ? (
          <>
            <div className="mb-4 flex items-center gap-6">
              <AlertCircle className="h-5 w-5" />
              <span className="font-bold">{errorTitle}</span>
            </div>
            <span>{errorBody}</span>
          </>
        ) : (
          <FoldableXMLOutput content={value} />
        )}
      </div>
    </div>
  );
}
