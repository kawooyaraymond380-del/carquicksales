'use client';

import { useState, useTransition } from 'react';
import { useApp } from '@/hooks/use-app';
import { getAISuggestions } from '@/app/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface AIServiceSuggesterProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function AIServiceSuggester({ onSuggestionClick }: AIServiceSuggesterProps) {
  const { t } = useApp();
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSuggest = () => {
    startTransition(async () => {
      const result = await getAISuggestions(prompt);
      setSuggestions(result);
    });
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          {t('ai-suggester-title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ai-prompt">{t('ai-suggester-placeholder')}</Label>
          <div className="flex gap-2">
            <Input
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('ai-suggester-placeholder')}
            />
            <Button onClick={handleSuggest} disabled={isPending}>
              {isPending ? '...' : t('ai-suggester-button')}
            </Button>
          </div>
        </div>
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="font-medium">{t('ai-suggestions-heading')}</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
