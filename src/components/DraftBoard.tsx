import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileText, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DraftBoardProps {
  content: string;
  isProcessing: boolean;
}

export const DraftBoard = ({ content, isProcessing }: DraftBoardProps) => {
  const [editableContent, setEditableContent] = useState(content);

  useEffect(() => {
    setEditableContent(content);
  }, [content]);

  const handleSave = () => {
    // Save functionality would go here
    console.log('Saving draft...');
  };

  const handleExport = () => {
    // Export functionality would go here
    const blob = new Blob([editableContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beat-story-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
  };

  if (isProcessing) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto animate-pulse-editorial" />
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">The Newsdesk Crew is Working</h3>
            <div className="space-y-2 text-sm text-newsroom-gray">
              <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>🔍 The Investigator is researching sources...</p>
              <p className="animate-fade-in" style={{ animationDelay: '0.4s' }}>✍️ The Correspondent is crafting the narrative...</p>
              <p className="animate-fade-in" style={{ animationDelay: '0.6s' }}>✅ The Gatekeeper is fact-checking...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Draft Header */}
      <div className="border-b border-border/50 px-4 py-3 bg-accent/30 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Draft Board</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="text-newsroom-gray hover:text-foreground rounded-xl"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="text-newsroom-gray hover:text-foreground rounded-xl"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Draft Content */}
      <div className="flex-1 p-4 pb-20">
        {content ? (
          <div className="h-full p-6">
            <ScrollArea className="h-full">
              <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="w-full h-full min-h-[600px] resize-none border-none outline-none text-foreground text-base leading-relaxed font-mono bg-transparent rounded-xl p-4"
                placeholder="Your story will appear here..."
              />
            </ScrollArea>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4 text-newsroom-gray">
              <FileText className="h-16 w-16 mx-auto opacity-50" />
              <div>
                <h3 className="text-lg font-medium mb-2">Ready for Your Next Story</h3>
                <p className="text-sm">Enter a query below to start the AI newsdesk crew</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};