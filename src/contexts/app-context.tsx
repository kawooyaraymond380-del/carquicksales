'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import { translations, type Language } from '@/lib/translations';
import { STAFF_MEMBERS } from '@/lib/constants';
import type { Service, Staff } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { format, startOfDay, endOfDay } from 'date-fns';

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  isAuthenticated: boolean;
  user: User | null;
  login: (user: string, pass: string) => void;
  signUp: (user: string, pass: string) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [staff] = useState<Staff[]>(STAFF_MEMBERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  const isAuthenticated = !!user;

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

  const login = async (email: string, password: string) => {
    showLoading();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: t('login-success'),
        variant: 'default',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t('login-failed'),
        variant: 'destructive',
      });
    } finally {
      hideLoading();
    }
  };

  const signUp = async (email: string, password: string) => {
    showLoading();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: t('signup-success-title'),
        description: t('signup-success-description'),
        variant: 'default',
      });
    } catch (error) {
      console.error(error);
      const firebaseError = error as { code?: string };
      let message = t('signup-failed');
      if (firebaseError.code === 'auth/email-already-in-use') {
        message = t('signup-failed-email-in-use');
      } else if (firebaseError.code === 'auth/weak-password') {
        message = t('signup-failed-weak-password');
      }
      toast({
        title: message,
        variant: 'destructive',
      });
    } finally {
      hideLoading();
    }
  };

  const logout = async () => {
    showLoading();
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const loadServicesForDate = useCallback(async (date: Date) => {
    if (!user) return;
    showLoading();
    try {
      const start = startOfDay(date);
      const end = endOfDay(date);
      const servicesCol = collection(db, 'services');
      const q = query(
        servicesCol,
        where('userId', '==', user.uid),
        where('timestamp', '>=', start),
        where('timestamp', '<=', end)
      );
      const querySnapshot = await getDocs(q);
      const servicesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
        } as Service;
      });
      setServices(servicesData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([]);
    } finally {
      hideLoading();
    }
  }, [user]);

  const addService = async (serviceData: Omit<Service, 'id' | 'timestamp'>) => {
    if (!user) return;
    showLoading();
    try {
      const now = new Date();
      const newService = {
        ...serviceData,
        timestamp: Timestamp.fromDate(now),
        userId: user.uid,
      };
      await addDoc(collection(db, 'services'), newService);
      
      // Reload services for the current day to show the new entry
      await loadServicesForDate(new Date());

      toast({ title: t('service-saved') });
    } catch (error) {
      console.error('Error adding service: ', error);
      toast({ title: 'Failed to save service', variant: 'destructive' });
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setIsInitialized(true);
      hideLoading();
    });
    setLanguage('ar');
    return () => unsubscribe();
  }, [setLanguage]);

  useEffect(() => {
    if (isInitialized && user) {
        loadServicesForDate(new Date());
    }
  }, [isInitialized, user, loadServicesForDate]);


  const value = {
    language,
    setLanguage,
    t,
    isAuthenticated,
    user,
    login,
    signUp,
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
