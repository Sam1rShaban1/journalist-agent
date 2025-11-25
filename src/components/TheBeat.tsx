import { useState } from 'react';
import { DraftBoard } from './DraftBoard';
import { AssignmentDesk } from './AssignmentDesk';
import { StoryFiles } from './StoryFiles';
import { SourceDossier } from './SourceDossier';
import { PanelLeft, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface Source {
  url: string;
  title: string;
  type: 'document' | 'article' | 'video' | 'data' | 'website';
  verified?: boolean;
  credibilityScore?: number;
}

interface RunStats {
  language: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  runtimeSeconds: number;
  estimatedCostUsd: number;
}

// Response shape from the FastAPI backend
type ArticleResponse = {
  language_detected: string;
  article_draft: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  crew_total_runtime_sec: number;
  estimated_cost_usd: number;
  sources?: Source[];
};

export const TheBeat = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [currentDraft, setCurrentDraft] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [runStats, setRunStats] = useState<RunStats | null>(null);

  const handleRunBeat = async (query: string, selectedModel: string) => {
    setIsProcessing(true);
    setCurrentDraft("");
    setRunStats(null);
    try {
      // reserved for future use (e.g., if backend supports model selection)
      void selectedModel;

      const baseUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;
      if (!baseUrl) {
        throw new Error('Missing VITE_BACKEND_URL environment variable. Create .env.local and set it to your ngrok base URL.');
      }

      const endpoint = `${baseUrl.replace(/\/$/, '')}/generate-article`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
      }

      const data: ArticleResponse = await res.json();
      setCurrentDraft(data?.article_draft || '');
      setSources(Array.isArray(data?.sources) ? data.sources : []);
      setRunStats({
        language: data.language_detected,
        promptTokens: data.prompt_tokens ?? 0,
        completionTokens: data.completion_tokens ?? 0,
        totalTokens: data.total_tokens ?? 0,
        runtimeSeconds: data.crew_total_runtime_sec ?? 0,
        estimatedCostUsd: data.estimated_cost_usd ?? 0,
      });

      toast.success('The crew finished the draft.');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to run The Beat.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative h-screen bg-gradient-subtle flex overflow-hidden p-4">
      {/* Floating reopen buttons when sidebars are collapsed */}
      {!leftSidebarOpen && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-50">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setLeftSidebarOpen(true)}
            aria-label="Open Story Files"
            className="rounded-full shadow-md"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!rightSidebarOpen && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-50">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setRightSidebarOpen(true)}
            aria-label="Open Source Dossier"
            className="rounded-full shadow-md"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
      {/* Main Layout */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left Sidebar - Story Files */}
        <div className={`${leftSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-500 ease-out overflow-hidden`}>
          <div className="h-full bg-background rounded-2xl shadow-panel border border-border/50 backdrop-blur-sm animate-fade-in">
            <StoryFiles 
              isOpen={leftSidebarOpen} 
              onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)} 
            />
          </div>
        </div>

        {/* Center - Draft Board with Floating Bottom Bar */}
        <div className="flex-1 relative">
          <div className="h-full bg-background rounded-2xl shadow-panel border border-border/50 backdrop-blur-sm overflow-hidden">
            <DraftBoard content={currentDraft} isProcessing={isProcessing} />
          </div>
          
          {/* Floating Bottom Bar inside center stage */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-background rounded-2xl shadow-panel border border-border/50 backdrop-blur-sm">
              <AssignmentDesk onRunBeat={handleRunBeat} isProcessing={isProcessing} runStats={runStats} />
            </div>
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