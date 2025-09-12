import { useState } from 'react';
import { Search, FileText, Clock, Star, Archive, PanelLeftClose } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface StoryFilesProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface Story {
  id: string;
  title: string;
  date: string;
  status: 'draft' | 'published' | 'archived';
  wordCount: number;
  starred: boolean;
}

const mockStories: Story[] = [
  {
    id: '1',
    title: 'Tech Giants Face New Antitrust Regulations',
    date: '2024-01-12',
    status: 'draft',
    wordCount: 1250,
    starred: true,
  },
  {
    id: '2',
    title: 'Climate Change Impact on Global Supply Chains',
    date: '2024-01-11',
    status: 'published',
    wordCount: 2100,
    starred: false,
  },
  {
    id: '3',
    title: 'AI in Healthcare: Revolutionary Breakthrough',
    date: '2024-01-10',
    status: 'draft',
    wordCount: 890,
    starred: true,
  },
  {
    id: '4',
    title: 'Economic Outlook for Q2 2024',
    date: '2024-01-09',
    status: 'archived',
    wordCount: 1600,
    starred: false,
  },
];

export const StoryFiles = ({ isOpen, onToggle }: StoryFilesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const filteredStories = mockStories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: Story['status']) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4 text-newsroom-gray" />;
      case 'published':
        return <FileText className="h-4 w-4 text-primary" />;
      case 'archived':
        return <Archive className="h-4 w-4 text-newsroom-gray" />;
    }
  };

  const getStatusColor = (status: Story['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-newsroom-gray/20 text-newsroom-gray';
      case 'published':
        return 'bg-primary/20 text-primary';
      case 'archived':
        return 'bg-newsroom-light text-newsroom-gray';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground flex items-center">
            <Archive className="h-5 w-5 mr-2 text-primary" />
            Story Files
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-accent rounded-xl transition-all duration-200"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-newsroom-gray" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stories..."
            className="pl-10 bg-accent/30 border-border rounded-xl"
          />
        </div>
      </div>

      {/* Story List */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-3">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-subtle hover-scale ${
                selectedStory === story.id
                  ? 'border-primary bg-primary/5 shadow-subtle'
                  : 'border-border/50 bg-background/80 hover:bg-accent/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(story.status)}
                  {story.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                </div>
                <Badge variant="secondary" className={getStatusColor(story.status)}>
                  {story.status}
                </Badge>
              </div>
              
              <h3 className="font-medium text-sm text-foreground leading-tight mb-2">
                {story.title}
              </h3>
              
              <div className="flex items-center justify-between text-xs text-newsroom-gray">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(story.date).toLocaleDateString()}
                </div>
                <span>{story.wordCount} words</span>
              </div>
            </div>
          ))}

          {filteredStories.length === 0 && (
            <div className="text-center py-8 text-newsroom-gray">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No stories found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};