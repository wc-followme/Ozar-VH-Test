'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ThankYouComponentProps {
  title?: string;
  message?: string;
}

export function ThankYouComponent({
  title = 'Thank You!',
  message = 'Your project details have been successfully submitted. We will review your information and get back to you soon.',
}: ThankYouComponentProps) {
  return (
    <div className='min-h-screen bg-[var(--white-background)] flex flex-col items-center justify-center p-4'>
      <Card className='w-full max-w-md bg-[var(--card-background)] shadow-lg border-0 rounded-3xl'>
        <CardContent className='p-8 text-center'>
          {/* Success Icon */}
          <div className='flex justify-center mb-6'>
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center'>
              <CheckCircle className='w-12 h-12 text-green-600' />
            </div>
          </div>

          {/* Title */}
          <h1 className='text-2xl font-bold text-[var(--text-dark)] mb-4'>
            {title}
          </h1>

          {/* Message */}
          <p className='text-[var(--text-secondary)] text-base leading-relaxed mb-8'>
            {message}
          </p>

          {/* Additional Info */}
          <div className='mt-6 pt-6 border-t border-[var(--border-light)]'>
            <p className='text-sm text-[var(--text-secondary)]'>
              You will receive a confirmation email shortly with further
              details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
