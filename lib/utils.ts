import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Encryption Utilities ---
import CryptoJS from 'crypto-js';

// Encrypts a string using AES and a secret key from env
export function encryptData(data: string): string {
  const key = process.env.NEXT_PUBLIC_PERMISSIONS_ENCRYPTION_KEY || '';
  if (!key) throw new Error('Encryption key is not set');
  return CryptoJS.AES.encrypt(data, key).toString();
}

// Decrypts a string using AES and a secret key from env
export function decryptData(ciphertext: string): string {
  const key = process.env.NEXT_PUBLIC_PERMISSIONS_ENCRYPTION_KEY || '';
  if (!key) throw new Error('Encryption key is not set');
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

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

// Extracts success message from API response
export function extractApiSuccessMessage(
  response: any,
  fallback = 'Operation completed successfully.'
) {
  if (response?.message) return response.message;
  return fallback;
}

// Formats a date string to DD/MM/YYYY format (e.g., "30/08/2024")
// This is the standard date format used across all modules
export function formatDate(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if invalid
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return dateString; // Return original string if parsing fails
  }
}

// Formats a date string to include time in DD/MM/YYYY HH:mm format
export function formatDateTime(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if invalid
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    return dateString; // Return original string if parsing fails
  }
}
