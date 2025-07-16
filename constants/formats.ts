// Common formatting constants used across the application

export const DATE_FORMATS = {
  // Standard display format: DD/MM/YYYY (e.g., "30/08/2024")
  DISPLAY: 'DD/MM/YYYY',
  // API format: YYYY-MM-DD (ISO date string)
  API: 'YYYY-MM-DD',
  // Date with time: DD/MM/YYYY HH:mm
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
} as const;

export const CURRENCY_FORMATS = {
  // Default currency symbol
  SYMBOL: '$',
  // Default locale for formatting
  LOCALE: 'en-US',
} as const;

export const FILE_SIZE_FORMATS = {
  // Maximum file size for uploads (in bytes)
  MAX_PROFILE_PICTURE_SIZE: 5 * 1024 * 1024, // 5MB
  // Supported image formats
  SUPPORTED_IMAGE_FORMATS: ['JPG', 'PNG', 'GIF'],
} as const;
