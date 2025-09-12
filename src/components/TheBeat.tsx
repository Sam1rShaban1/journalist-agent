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
    <div className="h-screen bg-gradient-subtle flex flex-col overflow-hidden p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold bg-gradient-editorial bg-clip-text text-transparent">
            The Beat
          </h1>
          <span className="text-sm text-newsroom-gray">AI-Powered Journalistic Workbench</span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Sidebar - Story Files */}
        <div className={`${leftSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-500 ease-out overflow-hidden`}>
          <div className="h-full bg-background rounded-2xl shadow-panel border border-border/50 backdrop-blur-sm animate-fade-in">
            <StoryFiles 
              isOpen={leftSidebarOpen} 
              onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)} 
            />
          </div>
        </div>

        {/* Center - Draft Board with Bottom Bar */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1 bg-background rounded-2xl shadow-panel border border-border/50 backdrop-blur-sm overflow-hidden">
            <DraftBoard content={currentDraft} isProcessing={isProcessing} />
          </div>
          
          {/* Bottom Bar positioned within center stage */}
          <div className="bg-background rounded-2xl shadow-panel border border-border/50 backdrop-blur-sm">
            <AssignmentDesk onRunBeat={handleRunBeat} isProcessing={isProcessing} />
          </div>
        </div>

        {/* Right Sidebar - Source Dossier */}
        <div className={`${rightSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-500 ease-out overflow-hidden`}>
          <div className="h-full bg-background rounded-2xl shadow-panel border border-border/50 backdrop-blur-sm animate-fade-in">
            <SourceDossier 
              sources={sources} 
              isOpen={rightSidebarOpen} 
              onToggle={() => setRightSidebarOpen(!rightSidebarOpen)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};