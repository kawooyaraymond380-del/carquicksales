'use client';

import { useState } from 'react';
import { useApp } from '@/hooks/use-app';
import { LoginForm } from '@/components/login-form';
import { SignUpForm } from '@/components/signup-form';
import { CarWashApp } from '@/components/car-wash-app';
import { LoadingOverlay } from '@/components/loading-overlay';

type AuthView = 'login' | 'signup';

export default function Home() {
  const { isAuthenticated, isLoading, isInitialized } = useApp();
  const [authView, setAuthView] = useState<AuthView>('login');

  if (!isInitialized) {
    return <LoadingOverlay />;
  }

  const renderAuth = () => {
    if (authView === 'login') {
      return <LoginForm onSwitchView={() => setAuthView('signup')} />;
    }
    return <SignUpForm onSwitchView={() => setAuthView('login')} />;
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      {isAuthenticated ? <CarWashApp /> : renderAuth()}
    </>
  );
}
