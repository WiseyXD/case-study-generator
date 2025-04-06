// components/Chat.tsx
import React, { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, Send, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./ui/avatar";
import { FormEvent } from "react";
import { Message } from "ai";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { MarkdownPreview } from "./markdown-preview";

interface ChatProps {
  messages: Message[];
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: Error | null | undefined;
}

export function Chat({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
}: ChatProps): React.ReactElement {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (error) {
    console.error("Error in Chat component:", error);
    return <div>Error: {error.message}</div>;
  }

  // Get the last assistant message for preview
  const lastAssistantMessage =
    messages.filter((message) => message.role === "assistant").slice(-1)[0]
      ?.content || "";

  // Template suggestions for new chat
  const suggestions = [
    {
      title: "Digital Marketing",
      description: "E-commerce success story",
      prompt:
        "Create a case study for a digital marketing campaign that increased e-commerce sales by 150%",
    },
    {
      title: "B2B SaaS",
      description: "Cost reduction story",
      prompt:
        "Write a B2B SaaS case study for a product that reduced customer support costs by 40%",
    },
    {
      title: "Non-profit",
      description: "Community engagement",
      prompt:
        "Create a non-profit case study showcasing a successful community engagement campaign",
    },
    {
      title: "Healthcare",
      description: "Innovation implementation",
      prompt:
        "Draft a healthcare innovation case study about implementing a new patient management system",
    },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center justify-end p-2 border-b bg-background">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span className="hidden sm:inline">Hide Preview</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Show Preview</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {showPreview ? "Hide Markdown Preview" : "Show Markdown Preview"}
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            "flex flex-col flex-1 transition-all duration-200 ease-in-out",
            showPreview ? "md:w-1/2" : "w-full",
          )}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
              <div className="max-w-md space-y-4">
                <h2 className="text-2xl font-bold">Generate a Case Study</h2>
                <p className="text-muted-foreground">
                  Describe your project, challenge, or success story, and I'll
                  generate a comprehensive case study for you.
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mt-6">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        // Create an input change event with the suggestion prompt
                        const mockEvent = {
                          target: { value: suggestion.prompt },
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleInputChange(mockEvent);
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{suggestion.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {suggestion.description}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="flex-1 overflow-y-auto"
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="max-w-3xl mx-auto space-y-4 p-4 pb-20">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg",
                      message.role === "user"
                        ? "bg-accent/50"
                        : "bg-background border",
                    )}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      {message.role === "user" ? (
                        <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center text-sm font-medium uppercase">
                          U
                        </div>
                      ) : (
                        <div className="bg-blue-500 text-white h-full w-full flex items-center justify-center text-sm font-medium">
                          AI
                        </div>
                      )}
                    </Avatar>
                    <div className="flex-1 overflow-x-auto">
                      <div className="font-medium mb-1">
                        {message.role === "user" ? "You" : "AI Assistant"}
                      </div>
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          <div className="p-4 border-t bg-background">
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 max-w-3xl mx-auto"
            >
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Describe your case study needs..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>

        {showPreview && (
          <div
            className={cn(
              "hidden md:block md:w-1/2 transition-all duration-200 ease-in-out",
              !lastAssistantMessage && "items-center justify-center",
            )}
          >
            {lastAssistantMessage ? (
              <MarkdownPreview content={lastAssistantMessage} />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>No content to preview yet</p>
              </div>
            )}
          </div>
        )}

        {/* Mobile Preview (shown when toggle is on and screen is small) */}
        {showPreview && lastAssistantMessage && (
          <div className="fixed inset-0 z-50 bg-background md:hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              <h2 className="text-lg font-semibold">Markdown Preview</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreview(false)}
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <MarkdownPreview content={lastAssistantMessage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
