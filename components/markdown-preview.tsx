// components/MarkdownPreview.tsx
import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({
  content,
}: MarkdownPreviewProps): React.ReactElement {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when content updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div className="flex flex-col h-full border-l overflow-hidden">
      <div className="p-4 border-b bg-muted/20 shrink-0">
        <h2 className="text-lg font-semibold">Preview</h2>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6"
        style={{ scrollbarWidth: "thin" }}
      >
        <div
          className={cn(
            "prose dark:prose-invert max-w-none",
            "prose-headings:scroll-mt-28",
            "prose-p:whitespace-pre-wrap",
            "prose-pre:overflow-x-auto",
          )}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
