'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import { translations, type Language } from '@/lib/translations';
import { STAFF_MEMBERS } from '@/lib/constants';
import type { Service, Staff } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  isAuthenticated: boolean;
  login: (user: string, pass: string) => void;
  logout: () => void;
  services: Service[];
  staff: Staff[];
  addService: (service: Omit<Service, 'id' | 'timestamp'>) => void;
  loadServicesForDate: (date: Date) => void;
  isLoading: boolean;
  isInitialized: boolean;
}

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [staff] = useState<Staff[]>(STAFF_MEMBERS);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const t = useCallback((key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key];
  }, [language]);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  const login = (username: string, password: string) => {
    showLoading();
    setTimeout(() => {
      if (username && password) {
        localStorage.setItem('jwt', 'example-jwt-token');
        setIsAuthenticated(true);
        toast({
          title: t('login-success'),
          variant: 'default',
        });
        loadServicesForDate(new Date());
      } else {
        toast({
          title: t('login-failed'),
          variant: 'destructive',
        });
      }
      hideLoading();
    }, 500);
  };

  const logout = () => {
    showLoading();
    setTimeout(() => {
      localStorage.removeItem('jwt');
      setIsAuthenticated(false);
      hideLoading();
    }, 500);
  };

  const toDateString = (date: Date) => date.toISOString().split('T')[0];

  const loadServicesForDate = useCallback((date: Date) => {
    showLoading();
    setTimeout(() => {
      const dateKey = `services_${toDateString(date)}`;
      const data = localStorage.getItem(dateKey);
      setServices(data ? JSON.parse(data) : []);
      hideLoading();
    }, 300);
  }, []);

  const addService = (serviceData: Omit<Service, 'id' | 'timestamp'>) => {
    showLoading();
    setTimeout(() => {
      const now = new Date();
      const newService: Service = {
        ...serviceData,
        id: now.getTime(),
        timestamp: now.toISOString(),
      };
      
      const dateKey = `services_${toDateString(now)}`;
      const existingServices = JSON.parse(localStorage.getItem(dateKey) || '[]') as Service[];
      const updatedServices = [...existingServices, newService];
      localStorage.setItem(dateKey, JSON.stringify(updatedServices));
      
      setServices(updatedServices);
      toast({ title: t('service-saved') });
      hideLoading();
    }, 300);
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsAuthenticated(true);
      loadServicesForDate(new Date());
    }
    setLanguage('ar');
    setIsInitialized(true);
  }, [loadServicesForDate]);

  const value = {
    language,
    setLanguage,
    t,
    isAuthenticated,
    login,
    logout,
    services,
    staff,
    addService,
    loadServicesForDate,
    isLoading,
    isInitialized,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
