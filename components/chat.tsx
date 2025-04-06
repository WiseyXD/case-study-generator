// components/Chat.tsx
import React, { useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar } from "./ui/avatar";
import { FormEvent } from "react";
import { Message } from "ai";

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
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-4 pb-20">
            {messages.map((message, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg",
                  message.role === "user" ? "bg-accent/50" : "bg-background",
                )}
              >
                <Avatar className="h-8 w-8">
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
                <div className="flex-1">
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
        </ScrollArea>
      )}

      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
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
  );
}
