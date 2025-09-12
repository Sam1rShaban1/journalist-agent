import { useState } from 'react';
import { DraftBoard } from './DraftBoard';
import { AssignmentDesk } from './AssignmentDesk';
import { StoryFiles } from './StoryFiles';
import { SourceDossier } from './SourceDossier';
import { PanelLeft, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Source {
  url: string;
  title: string;
  type: 'document' | 'article' | 'video' | 'data' | 'website';
  verified?: boolean;
  credibilityScore?: number;
}

export const TheBeat = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [currentDraft, setCurrentDraft] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunBeat = async (query: string, selectedModel: string) => {
    setIsProcessing(true);
    // Simulate the three-agent process
    setTimeout(() => {
      setCurrentDraft(`# Breaking: ${query}

**By The Beat AI Crew** | *${new Date().toLocaleDateString()}*

*This article was generated through our three-agent verification process: Research → Writing → Fact-checking*

## Executive Summary

Our investigative team has compiled a comprehensive analysis of "${query}" through extensive research and cross-verification of multiple sources.

## Key Findings

*[The Investigator's findings would appear here]*

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

## Background Context

*[The Correspondent's narrative structure]*

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Verification Notes

*[The Gatekeeper's editorial review]*

All claims in this article have been cross-referenced against multiple sources. Key verification points include:

- Source credibility assessment
- Timeline consistency check
- Cross-reference validation
- Bias detection review

---

*This draft is ready for your editorial review and enhancement.*`);

      setSources([
        { url: "https://example.com/source1", title: "Primary Source Document", type: "document" as const, verified: true, credibilityScore: 92 },
        { url: "https://example.com/source2", title: "Expert Commentary", type: "article" as const, verified: true, credibilityScore: 88 },
        { url: "https://example.com/source3", title: "Statistical Data", type: "data" as const, verified: true, credibilityScore: 95 },
        { url: "https://example.com/source4", title: "Video Analysis", type: "video" as const, verified: false, credibilityScore: 75 },
      ]);
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="h-screen bg-gradient-subtle flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-background border-b border-border shadow-subtle px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-editorial bg-clip-text text-transparent">
            The Beat
          </h1>
          <span className="text-sm text-newsroom-gray">AI-Powered Journalistic Workbench</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className="p-2 hover:bg-accent"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="p-2 hover:bg-accent"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Story Files */}
        <div className={`${leftSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-border bg-gradient-sidebar`}>
          <StoryFiles />
        </div>

        {/* Center - Draft Board */}
        <div className="flex-1 flex flex-col">
          <DraftBoard content={currentDraft} isProcessing={isProcessing} />
        </div>

        {/* Right Sidebar - Source Dossier */}
        <div className={`${rightSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-l border-border bg-gradient-sidebar`}>
          <SourceDossier sources={sources} />
        </div>
      </div>

      {/* Bottom Bar - Assignment Desk */}
      <AssignmentDesk onRunBeat={handleRunBeat} isProcessing={isProcessing} />
    </div>
  );
};