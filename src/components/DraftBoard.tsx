import { useState, useEffect, useMemo, useRef, type ComponentPropsWithoutRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileText, Save, Download, Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface DraftBoardProps {
  content: string;
  isProcessing: boolean;
  onViewportScroll?: (details: { direction: 'up' | 'down'; scrollTop: number }) => void;
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
    status: 'Signal gathering',
    description: 'Researching the most relevant sources and leads.',
  },
  {
    icon: '✍️',
    title: 'Correspondent',
    status: 'Narrative crafting',
    description: 'Turning insights into a compelling storyline.',
  },
  {
    icon: '✅',
    title: 'Gatekeeper',
    status: 'Quality review',
    description: 'Fact-checking every detail before publishing.',
  },
];

export const DraftBoard = ({ content, isProcessing, onViewportScroll }: DraftBoardProps) => {
  const [editableContent, setEditableContent] = useState(content);
  // State to toggle between editing and preview modes
  const [isEditing, setIsEditing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const hasContent = Boolean(editableContent.trim().length);
  const lastScrollTopRef = useRef(0);

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

  const stats = useMemo(() => {
    if (!editableContent.trim().length) {
      return { words: 0, paragraphs: 0, readingMinutes: 0 };
    }

    const words = editableContent
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const paragraphs = editableContent
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean).length;
    const readingMinutes = Math.max(1, Math.round(words / 200));

    return { words, paragraphs, readingMinutes };
  }, [editableContent]);

  const milestoneLabel = stats.words ? `${Math.ceil(stats.words / 250) * 250} words` : 'Kickoff milestone';
  const lastUpdated = useMemo(() => {
    if (!editableContent.trim().length) return 'Awaiting a fresh lead';
    return new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' }).format(new Date());
  }, [editableContent]);
  const progress = ((activeStep + 1) / statusSteps.length) * 100;

  const handleViewportScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!onViewportScroll) return;
    const currentScrollTop = event.currentTarget.scrollTop;
    const lastScrollTop = lastScrollTopRef.current;
    if (Math.abs(currentScrollTop - lastScrollTop) < 2) {
      return;
    }
    const direction = currentScrollTop > lastScrollTop ? 'down' : 'up';
    lastScrollTopRef.current = currentScrollTop;
    onViewportScroll({ direction, scrollTop: currentScrollTop });
  };

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
      <div className="flex-1 flex items-center justify-center h-full relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_60%)]" />
          <div className="absolute -bottom-20 left-20 w-[36rem] h-[36rem] bg-[radial-gradient(circle,_rgba(6,182,212,0.18),_transparent_70%)] blur-3xl" />
        </div>
        <div className="w-full max-w-3xl px-10 py-12 text-center space-y-10 bg-background/80 border border-border/40 rounded-[32px] backdrop-blur-2xl shadow-[0_40px_140px_rgba(15,23,42,0.35)] relative overflow-hidden">
          <div className="absolute inset-0 opacity-60 pointer-events-none">
            <div className="absolute right-10 top-6 h-48 w-48 rounded-full border border-primary/20 animate-spin-slow" />
            <div className="absolute left-10 bottom-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          </div>
          <div className="relative space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="h-28 w-28 rounded-full border-4 border-primary/20 border-t-primary/70 animate-spin" />
                <Loader2 className="h-12 w-12 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.45em] text-newsroom-gray">Live newsroom telemetry</p>
              <h3 className="text-3xl font-semibold text-foreground">The Newsdesk Crew Is On It</h3>
              <p className="text-base text-newsroom-gray">We’re orchestrating investigators, correspondents, and editors in real time.</p>
            </div>
            <div className="space-y-3 text-left" aria-live="polite">
              <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-indigo-400 to-cyan-300 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs uppercase tracking-[0.3em] text-newsroom-gray">
                <span>Dispatch</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="space-y-4">
              {statusSteps.map((step, index) => (
                <div
                  key={step.title}
                  className={`relative flex items-start gap-4 p-5 rounded-3xl border bg-background/70 backdrop-blur-xl transition-all duration-500 ${
                    index === activeStep
                      ? 'border-primary/70 shadow-lg shadow-primary/15 scale-[1.01] text-foreground'
                      : 'border-border/50 opacity-75'
                  }`}
                >
                  <span
                    className={`text-2xl ${index === activeStep ? 'animate-bounce' : ''}`}
                    aria-hidden="true"
                  >
                    {step.icon}
                  </span>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-lg">{step.title}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {step.status}
                      </span>
                      {index === activeStep && (
                        <span className="text-xs uppercase tracking-[0.3em] text-newsroom-gray">Active</span>
                      )}
                    </div>
                    <p className="text-sm text-newsroom-gray">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-[radial-gradient(circle,_rgba(6,182,212,0.16),_transparent_70%)] blur-3xl" />
      </div>
      <div className="relative flex flex-col h-full rounded-[28px] border border-border/40 bg-gradient-to-b from-background/95 via-background/80 to-background/95 backdrop-blur-2xl shadow-[0_30px_120px_rgba(15,23,42,0.35)] overflow-hidden">
        <div className="px-6 py-5 border-b border-border/40 bg-background/50 flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner shadow-primary/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Draft Board</h2>
              <p className="text-sm text-newsroom-gray">Polish, review, and broadcast your scoop</p>
            </div>
          </div>
          <div className="flex-1 flex flex-wrap items-center justify-end gap-2 text-xs">
            <span className="px-3 py-1 rounded-full border border-border/50 bg-background/60 text-newsroom-gray">
              Word count <span className="font-semibold text-foreground ml-1">{stats.words}</span>
            </span>
            <span className="px-3 py-1 rounded-full border border-border/50 bg-background/60 text-newsroom-gray">
              Reading time <span className="font-semibold text-foreground ml-1">{stats.readingMinutes || '–'} min</span>
            </span>
            <span className="px-3 py-1 rounded-full border border-border/50 bg-background/60 text-newsroom-gray">
              Next marker <span className="font-semibold text-foreground ml-1">{milestoneLabel}</span>
            </span>
          </div>
        </div>

        {/* <div className="px-6 py-4 border-b border-border/30 bg-background/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-newsroom-gray">
            <span className="px-3 py-1 rounded-full border border-border/40 bg-background/70">
              Updated {lastUpdated}
            </span>
            <span className="px-3 py-1 rounded-full border border-border/40 bg-background/70">
              {stats.paragraphs || 0} sections
            </span>
          </div>
          {hasContent && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-2xl border border-border/50 bg-background/70 text-newsroom-gray hover:text-foreground"
              >
                {isEditing ? (
                  <span className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4" /> Preview
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-sm">
                    <Pencil className="h-4 w-4" /> Edit
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="rounded-2xl border border-border/50 bg-background/70 text-newsroom-gray hover:text-foreground"
              >
                <Save className="h-4 w-4 mr-2" />Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="rounded-2xl border border-border/50 bg-background/70 text-newsroom-gray hover:text-foreground"
              >
                <Download className="h-4 w-4 mr-2" />Export
              </Button>
            </div>
          )}
        </div> */}

        <div className="flex-1 overflow-hidden">
          {hasContent ? (
            <ScrollArea className="h-full" onViewportScroll={handleViewportScroll}>
              <div className="p-8 space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {[{
                    label: 'Story cadence',
                    value: stats.words ? `${Math.min(100, Math.round((stats.words / 1500) * 100))}%` : '0%',
                    sublabel: 'Target 1500 words',
                  },
                  {
                    label: 'Paragraphs',
                    value: stats.paragraphs,
                    sublabel: 'Structured clarity',
                  },
                  {
                    label: 'Reading window',
                    value: stats.readingMinutes ? `${stats.readingMinutes} min` : 'N/A',
                    sublabel: 'Est. editorial review',
                  }].map((metric) => (
                    <div key={metric.label} className="p-4 rounded-3xl border border-border/40 bg-background/70 backdrop-blur-xl shadow-inner shadow-black/5">
                      <p className="text-xs uppercase tracking-[0.3em] text-newsroom-gray">{metric.label}</p>
                      <p className="text-2xl font-semibold text-foreground mt-1">{metric.value}</p>
                      <p className="text-xs text-newsroom-gray mt-2">{metric.sublabel}</p>
                    </div>
                  ))}
                </div>

                {isEditing ? (
                  <textarea
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                    className="w-full min-h-[calc(100vh-320px)] rounded-[28px] border border-border/40 bg-background/90 backdrop-blur-xl px-6 py-5 font-mono text-sm leading-6 text-foreground shadow-[0_20px_60px_rgba(10,10,10,0.25)] focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300"
                    placeholder="Your story unfolds here..."
                  />
                ) : (
                  <article className="prose prose-stone dark:prose-invert max-w-none rounded-[28px] border border-border/40 bg-background/90 backdrop-blur-xl px-8 py-10 shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
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
            <div className="h-full flex items-center justify-center text-center px-6">
              <div className="space-y-5 max-w-md">
                <div className="relative inline-flex">
                  <div className="h-24 w-24 rounded-full bg-primary/10 blur-2xl absolute inset-0" />
                  <FileText className="h-16 w-16 mx-auto text-primary relative" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.4em] text-newsroom-gray">Nothing on the board yet</p>
                  <h3 className="text-2xl font-semibold text-foreground">Ready for Your Next Story</h3>
                  <p className="text-sm text-newsroom-gray">
                    Launch the AI newsdesk from The Beat panel, then watch your investigation, narrative, and fact check unfold here in real time.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
