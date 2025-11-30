import { useState, useCallback } from 'react';
import { DraftBoard } from './DraftBoard';
import { AssignmentDesk } from './AssignmentDesk';
import { StoryFiles } from './StoryFiles';
import { SourceDossier } from './SourceDossier';
import { PanelLeft, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

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
  const [isAssignmentDeskVisible, setAssignmentDeskVisible] = useState(true);

  const handleRunBeat = async (query: string, selectedModel: string) => {
    setIsProcessing(true);
    setCurrentDraft("");
    setRunStats(null);
    setAssignmentDeskVisible(true);
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
      setAssignmentDeskVisible(false);

      toast.success('The crew finished the draft.');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to run The Beat.');
    } finally {
      setIsProcessing(false);
    }
  };

  const hasDraftContent = currentDraft.trim().length > 0;
  const canAutoHideAssignmentDesk = !isProcessing && hasDraftContent;
  const assignmentDeskShouldHide = canAutoHideAssignmentDesk && !isAssignmentDeskVisible;

  const handleDraftScroll = useCallback(
    ({ direction, scrollTop }: { direction: 'up' | 'down'; scrollTop: number }) => {
      if (!canAutoHideAssignmentDesk) {
        return;
      }
      if (direction === 'down' && scrollTop > 80) {
        setAssignmentDeskVisible(false);
      } else if (direction === 'up') {
        setAssignmentDeskVisible(true);
      }
    },
    [canAutoHideAssignmentDesk]
  );

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
        <div className="flex-1 relative flex flex-col space-y-4">
          {/* Temporary Markdown Input */}
          <div className="bg-background/80 rounded-2xl p-4 border border-dashed border-border/50">
            <h3 className="text-sm font-medium mb-2 text-foreground/80">Temporary Markdown Input</h3>
            <textarea
              className="w-full h-40 p-3 text-sm rounded-lg border border-border/50 bg-background/50 font-mono"
              placeholder="Paste or type markdown here to preview below..."
              value={currentDraft}
              onChange={(e) => setCurrentDraft(e.target.value)}
            />
          </div>
          <div className="flex-1 h-full bg-background rounded-2xl shadow-panel border border-border/50 backdrop-blur-sm overflow-hidden">
            <DraftBoard
              content={currentDraft}
              isProcessing={isProcessing}
              onViewportScroll={handleDraftScroll}
            />
          </div>

          {/* Floating Bottom Bar inside center stage */}
          <div
            className={cn(
              'absolute bottom-4 left-4 right-4 transition-all duration-300 ease-out',
              assignmentDeskShouldHide
                ? 'translate-y-[calc(100%+1rem)] opacity-0 pointer-events-none'
                : 'translate-y-0 opacity-100 pointer-events-auto'
            )}
          >
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