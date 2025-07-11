import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
