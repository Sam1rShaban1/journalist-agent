import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Loader2, GaugeCircle, Coins } from 'lucide-react';

interface AssignmentDeskProps {
  onRunBriefing: (query: string, model: string) => void;
  isProcessing: boolean;
  runStats?: {
    language: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    runtimeSeconds: number;
    estimatedCostUsd: number;
  } | null;
}

export const AssignmentDesk = ({ onRunBriefing, isProcessing, runStats }: AssignmentDeskProps) => {
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      onRunBriefing(query.trim(), selectedModel);
    }
  };

  const models = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'mistral-large', label: 'Mistral Large' },
  ];

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        {/* Model Selector */}
        <div className="w-48">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="bg-accent/30 border-border/50 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Input */}
        <div className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter assignment brief"
            className="bg-accent/30 border-border/50 text-lg py-6 px-4 placeholder:text-newsroom-gray focus:border-primary transition-all duration-300 rounded-xl"
            disabled={isProcessing}
          />
        </div>

        {/* Run Button */}
        <Button
          type="submit"
          disabled={!query.trim() || isProcessing}
          className="bg-gradient-editorial hover:shadow-editorial transition-all duration-300 px-8 py-6 text-base font-semibold rounded-xl hover-scale"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Preparing briefing
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Run Briefing
            </>
          )}
        </Button>
      </form>

      {runStats && !isProcessing && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="p-3 rounded-xl border border-border/60 bg-accent/20">
            <p className="text-xs uppercase tracking-[0.2em] text-newsroom-gray">Token Usage</p>
            <p className="text-base font-semibold text-foreground">
              {runStats.totalTokens.toLocaleString()}
            </p>
            <p className="text-xs text-newsroom-gray">
              Input {runStats.promptTokens.toLocaleString()} · Output {runStats.completionTokens.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-xl border border-border/60 bg-accent/20 flex items-center gap-3">
            <GaugeCircle className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-newsroom-gray">Processing Time</p>
              <p className="text-base font-semibold text-foreground">
                {runStats.runtimeSeconds.toFixed(1)}s
              </p>
              <p className="text-xs text-newsroom-gray">Language: {runStats.language || '–'}</p>
            </div>
          </div>
          <div className="p-3 rounded-xl border border-border/60 bg-accent/20 flex items-center gap-3">
            <Coins className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-newsroom-gray">Cost Estimate</p>
              <p className="text-base font-semibold text-foreground">
                ${runStats.estimatedCostUsd.toFixed(4)}
              </p>
              <p className="text-xs text-newsroom-gray">Per submission</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};