// components/MarkdownPreview.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "./ui/scroll-area";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({
  content,
}: MarkdownPreviewProps): React.ReactElement {
  return (
    <div className="flex flex-col h-screen border-l overflow-hidden">
      <div className="p-4 border-b bg-muted/20 shrink-0">
        <h2 className="text-lg font-semibold">Preview</h2>
      </div>
      <ScrollArea className="flex-1 p-6 overflow-auto">
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </ScrollArea>
    </div>
  );
}
