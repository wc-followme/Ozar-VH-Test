import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showToast({
  toast,
  type,
  title,
  description,
}: {
  toast: any;
  type?: 'success' | 'error' | 'default';
  title: string;
  description: string;
}) {
  toast({
    title,
    description,
    variant: type === 'error' ? 'destructive' : 'default',
  });
}

// Extracts a user-friendly error message from API error responses
export function extractApiErrorMessage(
  err: any,
  fallback = 'An error occurred.'
) {
  if (err?.details?.message) return err.details.message;
  if (err?.message) return err.message;
  return fallback;
}
