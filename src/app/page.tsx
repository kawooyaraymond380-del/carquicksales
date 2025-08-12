'use client';

import { useApp } from '@/hooks/use-app';
import { LoginForm } from '@/components/login-form';
import { CarWashApp } from '@/components/car-wash-app';
import { LoadingOverlay } from '@/components/loading-overlay';

export default function Home() {
  const { isAuthenticated, isLoading, isInitialized } = useApp();

  if (!isInitialized) {
    return <LoadingOverlay />;
  }

  return (
    <>
      {isLoading && <LoadingOverlay />}
      {isAuthenticated ? <CarWashApp /> : <LoginForm />}
    </>
  );
}
