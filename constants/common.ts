// Common application constants

// API Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 10, // Standard limit for most listing pages
  USERS_LIMIT: 20, // Higher limit for user listing to improve infinite scroll UX
  ROLES_DROPDOWN_LIMIT: 50, // Higher limit for role dropdowns to get complete lists
} as const;

// General App Constants
export const APP_CONFIG = {
  SEARCH_DEBOUNCE_MS: 300,
  TOAST_AUTO_HIDE_MS: 3000,
} as const;

// Future constants can be added here
// export const OTHER_CONSTANTS = {
//   // Add new constants as needed
// } as const;
