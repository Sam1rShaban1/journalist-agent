import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle color mode"
      onClick={toggleTheme}
      className="relative rounded-full border border-border/40 bg-background hover:bg-accent"
    >
      <Sun
        className={cn(
          'h-4 w-4 transition-all duration-200',
          isDark ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
        )}
      />
      <Moon
        className={cn(
          'absolute h-4 w-4 transition-all duration-200',
          isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        )}
      />
    </Button>
  );
};
