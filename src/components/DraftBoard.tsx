import { useState, useEffect, type ComponentPropsWithoutRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileText, Save, Download, Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface DraftBoardProps {
  content: string;
  isProcessing: boolean;
}

type CodeProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
  node?: unknown;
};

const markdownComponents: Components = {
  h1: ({ node, ...props }) => (
    <h1 className="text-3xl font-bold mt-10 mb-4 border-b border-border/60 pb-2" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-2xl font-semibold mt-8 mb-3 border-b border-border/40 pb-1" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-xl font-semibold mt-6 mb-2" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="leading-relaxed text-base text-foreground/90 mb-4" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-6 space-y-2 mb-6" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-6 space-y-2 mb-6" {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="border-l-4 border-primary/70 pl-4 italic text-foreground/80 bg-primary/5 py-3 rounded-r-lg mb-6"
      {...props}
    />
  ),
  code: ({ node: _node, inline, className, children, ...rest }: CodeProps) => {
    if (inline) {
      return (
        <code className="px-1.5 py-0.5 rounded-md bg-muted/80 text-sm font-mono" {...rest}>
          {children}
        </code>
      );
    }

    return (
      <pre className="bg-muted/80 rounded-xl p-4 overflow-auto mb-6">
        <code className="text-sm font-mono" {...rest}>
          {children}
        </code>
      </pre>
    );
  },
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full text-left border border-border/40 rounded-xl" {...props} />
    </div>
  ),
  th: ({ node, ...props }) => (
    <th className="px-4 py-2 border-b border-border/40 bg-muted/70 font-semibold" {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className="px-4 py-2 border-b border-border/40" {...props} />
  ),
};

const statusSteps = [
  {
    icon: '🔍',
    title: 'Investigator',
    description: 'Researching the most relevant sources and leads.',
  },
  {
    icon: '✍️',
    title: 'Correspondent',
    description: 'Crafting a compelling narrative from the findings.',
  },
  {
    icon: '✅',
    title: 'Gatekeeper',
    description: 'Fact-checking every detail before publishing.',
  },
];

export const DraftBoard = ({ content, isProcessing }: DraftBoardProps) => {
  const [editableContent, setEditableContent] = useState(content);
  // State to toggle between editing and preview modes
  const [isEditing, setIsEditing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setEditableContent(content);
    // When new content arrives, switch to preview mode by default
    if (content) {
      setIsEditing(false);
    }
  }, [content]);

  useEffect(() => {
    if (!isProcessing) {
      setActiveStep(0);
      return;
    }

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % statusSteps.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [isProcessing]);

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
        <div className="w-full max-w-xl px-8 py-10 text-center space-y-8 animate-fade-in">
          <div className="relative flex items-center justify-center">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary/20 to-primary/0 animate-pulse blur-2xl absolute" />
            <div className="h-24 w-24 rounded-full border-4 border-primary/30 border-t-primary/80 animate-spin" />
            <Loader2 className="h-10 w-10 text-primary absolute animate-pulse" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">The Newsdesk Crew Is On It</h3>
            <p className="text-sm uppercase tracking-[0.3em] text-newsroom-gray">Live progress</p>
          </div>
          <div className="space-y-4" aria-live="polite">
            {statusSteps.map((step, index) => (
              <div
                key={step.title}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 text-left bg-background/60 backdrop-blur-sm ${
                  index === activeStep
                    ? 'border-primary/70 shadow-lg shadow-primary/20 scale-[1.01]'
                    : 'border-border/50 opacity-70'
                }`}
              >
                <span
                  className={`text-2xl ${index === activeStep ? 'animate-bounce' : ''}`}
                  aria-hidden="true"
                >
                  {step.icon}
                </span>
                <div>
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    {step.title}
                    {index === activeStep && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        in progress
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-newsroom-gray mt-1">{step.description}</p>
                </div>
              </div>
            ))}
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
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={markdownComponents}
                  >
                    {editableContent}
                  </ReactMarkdown>
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
