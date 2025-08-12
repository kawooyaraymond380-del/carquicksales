'use client';

import { useState } from 'react';
import { Settings, Globe } from 'lucide-react';
import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsDialog } from '@/components/settings-dialog';
import type { Language } from '@/lib/translations';

export function Header() {
  const { t, language, setLanguage } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-primary">{t('app-title')}</h1>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <SelectTrigger className="w-auto gap-2">
                <Globe className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">{t('settings-arabic')}</SelectItem>
                <SelectItem value="en">{t('settings-english')}</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-5 w-5" />
              <span className="sr-only">{t('settings-title')}</span>
            </Button>
          </div>
        </div>
      </header>
      <SettingsDialog isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}
