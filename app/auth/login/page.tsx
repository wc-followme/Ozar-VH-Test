'use client';

import LoadingComponent from '@/components/shared/common/LoadingComponent';
import { Suspense } from 'react';
import LoginPageContent from './LoginPageContent';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingComponent variant='fullscreen' />}>
      <LoginPageContent />
    </Suspense>
  );
}
