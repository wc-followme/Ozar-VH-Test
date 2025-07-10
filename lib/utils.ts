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
