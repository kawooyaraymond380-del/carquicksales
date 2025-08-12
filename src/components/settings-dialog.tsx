'use client';

import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, User } from 'lucide-react';
import type { Language } from '@/lib/translations';

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ isOpen, onOpenChange }: SettingsDialogProps) {
  const { t, language, setLanguage, logout, user } = useApp();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('settings-title')}</DialogTitle>
          {user?.email && (
            <DialogDescription className="flex items-center gap-2 pt-2">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="language-select">{t('settings-language-label')}</Label>
            <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <SelectTrigger id="language-select">
                <SelectValue placeholder={t('settings-language-label')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">{t('settings-arabic')}</SelectItem>
                <SelectItem value="en">{t('settings-english')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="h-4 w-4" />
            <span>{t('logout-text')}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
