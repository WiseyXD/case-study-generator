// components/Sidebar.tsx
import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Sparkles, FileText, PlusCircle } from "lucide-react";

interface CaseStudy {
  id: number;
  name: string;
  date: string;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  caseName: string;
  setCaseName: (name: string) => void;
  caseStudies: CaseStudy[];
  currentCaseId: number | null;
  setCurrentCaseId: (id: number) => void;
  onNewCase: () => void;
}

export function Sidebar({
  isOpen,
  setIsOpen,
  caseName,
  setCaseName,
  caseStudies,
  currentCaseId,
  setCurrentCaseId,
  onNewCase,
}: SidebarProps): React.ReactElement {
  return (
    <>
      {/* Desktop sidebar */}
      <div
        className={`hidden md:flex md:flex-col md:w-64 md:bg-muted/40 md:border-r md:h-full md:p-4 md:space-y-4`}
      >
        <div className="flex items-center gap-2 px-2 mb-2">
          <Sparkles className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Case Studies</h2>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Enter case study name..."
            value={caseName}
            onChange={(e) => setCaseName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={onNewCase} size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 mt-4">
          {caseStudies.map((caseStudy) => (
            <Button
              key={caseStudy.id}
              variant={currentCaseId === caseStudy.id ? "secondary" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => setCurrentCaseId(caseStudy.id)}
            >
              <FileText className="mr-2 h-4 w-4" />
              <div className="truncate flex-1">
                <div className="font-medium">{caseStudy.name}</div>
                <div className="text-xs opacity-70">{caseStudy.date}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile sidebar (Sheet component) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Case Studies
            </SheetTitle>
          </SheetHeader>

          <div className="p-4 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter case study name..."
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={onNewCase} size="icon">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 mt-4">
              {caseStudies.map((caseStudy) => (
                <Button
                  key={caseStudy.id}
                  variant={
                    currentCaseId === caseStudy.id ? "secondary" : "ghost"
                  }
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setCurrentCaseId(caseStudy.id);
                    setIsOpen(false);
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <div className="truncate flex-1">
                    <div className="font-medium">{caseStudy.name}</div>
                    <div className="text-xs opacity-70">{caseStudy.date}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
