import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type React from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('is_authenticated')?.value === 'true';
  const authToken = cookieStore.get('auth_token');

  // Redirect to login if not authenticated
  if (!isAuthenticated || !authToken) {
    redirect('/auth/login');
  }

  return (
    <div className='flex bg-[var(--white-background)]'>
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <Header />
        <main className='rounded-t-[30px] p-6 bg-[var(--background)] flex-1'>
          {children}
        </main>
      </div>
    </div>
  );
}
