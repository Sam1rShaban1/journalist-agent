import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Loader2 } from 'lucide-react';

interface AssignmentDeskProps {
  onRunBeat: (query: string, model: string) => void;
  isProcessing: boolean;
}

export const AssignmentDesk = ({ onRunBeat, isProcessing }: AssignmentDeskProps) => {
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      onRunBeat(query.trim(), selectedModel);
    }
  };

  const models = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'mistral-large', label: 'Mistral Large' },
  ];

  return (
    <div className="p-4">
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
              placeholder="What's the story you're breaking?"
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
                Running The Beat
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Investigate
              </>
            )}
          </Button>
        </form>
    </div>
  );
};