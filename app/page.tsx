// App.tsx - Main application component
"use client";
import { Chat } from "@/components/chat";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useChat } from "ai/react";
import { FileDown } from "lucide-react";
// Define TypeScript interfaces for our data structures
interface CaseStudy {
  id: number;
  name: string;
  date: string;
}

interface GeneratedCase {
  title: string;
  content: string;
}

export default function Home(): React.ReactElement {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [caseName, setCaseName] = useState<string>("");
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([
    { id: 1, name: "E-commerce Rebrand Case Study", date: "April 5, 2025" },
    { id: 2, name: "SaaS Growth Strategy", date: "April 2, 2025" },
  ]);
  const [currentCaseId, setCurrentCaseId] = useState<number | null>(null);
  const [generatedCase, setGeneratedCase] = useState<GeneratedCase | null>(
    null,
  );

  // Set up Vercel AI SDK's useChat hook
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/generate-case-study",
      onFinish: (message) => {
        if (message.role === "assistant") {
          console.log("err", error);
          console.log("res", message);
          // When a complete message is received, create a downloadable case study
          setGeneratedCase({
            title: caseName || "Generated Case Study",
            content: message.content,
          });
        }
      },
    });

  const handleNewCase = (): void => {
    const newCase: CaseStudy = {
      id: Date.now(),
      name: caseName || "New Case Study",
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
    setCaseStudies([newCase, ...caseStudies]);
    setCurrentCaseId(newCase.id);
    // Reset the chat
    messages.splice(0, messages.length);
    setGeneratedCase(null);
    setCaseName("");
  };

  const handleDownload = (): void => {
    if (!generatedCase) return;

    const blob = new Blob([generatedCase.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedCase.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        caseName={caseName}
        setCaseName={setCaseName}
        caseStudies={caseStudies}
        currentCaseId={currentCaseId}
        setCurrentCaseId={setCurrentCaseId}
        onNewCase={handleNewCase}
      />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden"
          >
            <span className="sr-only">Toggle Sidebar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
          <h1 className="text-xl font-bold">Case Study Generator</h1>
        </header>

        <Chat
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />

        {generatedCase && (
          <div className="flex justify-center p-4 border-t">
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <FileDown size={16} />
              Download Case Study
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
