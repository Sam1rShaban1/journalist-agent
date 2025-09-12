import { ExternalLink, FileText, Video, Database, Globe, CheckCircle, AlertCircle, PanelRightClose } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Source {
  url: string;
  title: string;
  type: 'document' | 'article' | 'video' | 'data' | 'website';
  verified?: boolean;
  credibilityScore?: number;
}

interface SourceDossierProps {
  sources: Source[];
  isOpen: boolean;
  onToggle: () => void;
}

export const SourceDossier = ({ sources, isOpen, onToggle }: SourceDossierProps) => {
  const getSourceIcon = (type: Source['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'article':
        return <Globe className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'data':
        return <Database className="h-4 w-4" />;
      case 'website':
        return <Globe className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Source['type']) => {
    switch (type) {
      case 'document':
        return 'bg-blue-100 text-blue-700';
      case 'article':
        return 'bg-green-100 text-green-700';
      case 'video':
        return 'bg-purple-100 text-purple-700';
      case 'data':
        return 'bg-orange-100 text-orange-700';
      case 'website':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCredibilityBadge = (score?: number) => {
    if (!score) return null;
    
    if (score >= 85) {
      return (
        <Badge className="bg-green-100 text-green-700 text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          High
        </Badge>
      );
    } else if (score >= 70) {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          Medium
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-700 text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          Low
        </Badge>
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-foreground flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-primary" />
            Source Dossier
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-accent rounded-xl transition-all duration-200"
          >
            <PanelRightClose className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-newsroom-gray">
          Verified sources from The Investigator
        </p>
      </div>

      {/* Sources List */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {sources.length > 0 ? (
            sources.map((source, index) => (
              <div
                key={index}
                className="p-5 border border-border/50 rounded-xl bg-background/80 hover:bg-accent/30 transition-all duration-300 hover-scale"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getSourceIcon(source.type)}
                    <Badge className={getTypeColor(source.type)}>
                      {source.type}
                    </Badge>
                  </div>
                  {getCredibilityBadge(source.credibilityScore)}
                </div>
                
                <h3 className="font-medium text-sm text-foreground mb-2 leading-tight">
                  {source.title}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-newsroom-gray truncate flex-1 mr-2">
                    {source.url}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto text-newsroom-gray hover:text-primary"
                    onClick={() => window.open(source.url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                
                {source.verified && (
                  <div className="mt-2 flex items-center text-xs text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified by The Gatekeeper
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-newsroom-gray">
              <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No sources available</p>
              <p className="text-xs mt-1">Sources will appear here after running The Beat</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      {sources.length > 0 && (
        <div className="p-4 border-t border-border bg-accent/20">
          <div className="text-xs text-newsroom-gray space-y-1">
            <div className="flex justify-between">
              <span>Total Sources:</span>
              <span className="font-medium">{sources.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Verified:</span>
              <span className="font-medium text-green-600">
                {sources.filter(s => s.verified).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Avg. Credibility:</span>
              <span className="font-medium">
                {Math.round(
                  sources.reduce((acc, s) => acc + (s.credibilityScore || 0), 0) / sources.length
                )}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};