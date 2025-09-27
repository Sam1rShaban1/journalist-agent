import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileText, Save, Download, Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DraftBoardProps {
  content: string;
  isProcessing: boolean;
}

export const DraftBoard = ({ content, isProcessing }: DraftBoardProps) => {
  const [editableContent, setEditableContent] = useState(content);
  // State to toggle between editing and preview modes
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditableContent(content);
    // When new content arrives, switch to preview mode by default
    if (content) {
      setIsEditing(false);
    }
  }, [content]);

  const handleSave = () => {
    // Save functionality would go here
    console.log('Saving draft...');
    setIsEditing(false); // Switch to preview after saving
  };

  const handleExport = () => {
    const blob = new Blob([editableContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beat-story-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isProcessing) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center space-y-6 animate-fade-in">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto animate-pulse-editorial" />
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">The Newsdesk Crew is Working</h3>
            <div className="space-y-2 text-sm text-newsroom-gray">
              <p>🔍 The Investigator is researching sources...</p>
              <p>✍️ The Correspondent is crafting the narrative...</p>
              <p>✅ The Gatekeeper is fact-checking...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Draft Header */}
      <div className="border-b border-border/50 px-4 py-3 bg-accent/30 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Draft Board</h2>
          </div>
          {content && (
            <div className="flex items-center space-x-2">
               <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-newsroom-gray hover:text-foreground rounded-xl"
              >
                {isEditing ? <><Eye className="h-4 w-4 mr-1" />Preview</> : <><Pencil className="h-4 w-4 mr-1" />Edit</>}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSave} className="text-newsroom-gray hover:text-foreground rounded-xl">
                <Save className="h-4 w-4 mr-1" />Save
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExport} className="text-newsroom-gray hover:text-foreground rounded-xl">
                <Download className="h-4 w-4 mr-1" />Export
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Draft Content */}
      <div className="flex-1 overflow-hidden">
        {content ? (
          <ScrollArea className="h-full">
            <div className="p-6">
              {isEditing ? (
                // EDIT MODE
                <textarea
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  className="w-full min-h-[calc(100vh-200px)] resize-none border-none outline-none bg-transparent font-mono"
                  placeholder="Your story will appear here..."
                />
              ) : (
                // PREVIEW MODE
                <article className="prose prose-stone dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{editableContent}</ReactMarkdown>
                </article>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="h-full flex items-center justify-center text-center text-newsroom-gray">
            <div className="space-y-4">
              <FileText className="h-16 w-16 mx-auto opacity-50" />
              <div>
                <h3 className="text-lg font-medium">Ready for Your Next Story</h3>
                <p className="text-sm">Enter a query below to start the AI newsdesk crew</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
