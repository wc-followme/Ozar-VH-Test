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

// Country codes and phone number related constants
export const COUNTRY_CODES = {
  // Key-value mapping for easy lookup (country key -> phone code)
  MAP: {
    us: '+1',
    ca: '+1',
    gb: '+44',
    au: '+61',
    de: '+49',
    fr: '+33',
    it: '+39',
    es: '+34',
    nl: '+31',
    ch: '+41',
    se: '+46',
    no: '+47',
    dk: '+45',
    fi: '+358',
    at: '+43',
    be: '+32',
    pt: '+351',
    ie: '+353',
    lu: '+352',
    in: '+91',
    jp: '+81',
    kr: '+82',
    cn: '+86',
    hk: '+852',
    sg: '+65',
    my: '+60',
    th: '+66',
    ph: '+63',
    id: '+62',
    vn: '+84',
    tw: '+886',
    ru: '+7',
    ua: '+380',
    pl: '+48',
    cz: '+420',
    sk: '+421',
    hu: '+36',
    ro: '+40',
    bg: '+359',
    hr: '+385',
    si: '+386',
    ee: '+372',
    lv: '+371',
    lt: '+370',
    is: '+354',
    mt: '+356',
    cy: '+357',
    br: '+55',
    ar: '+54',
    cl: '+56',
    co: '+57',
    pe: '+51',
    mx: '+52',
    za: '+27',
    eg: '+20',
    ma: '+212',
    ng: '+234',
    ke: '+254',
    tz: '+255',
    tr: '+90',
    il: '+972',
    ae: '+971',
    sa: '+966',
    kw: '+965',
    qa: '+974',
    bh: '+973',
    om: '+968',
    jo: '+962',
    lb: '+961',
    iq: '+964',
    ir: '+98',
    af: '+93',
    pk: '+92',
    bd: '+880',
    lk: '+94',
    np: '+977',
    bt: '+975',
    mv: '+960',
    mn: '+976',
  },

  // Array format for dropdowns with additional metadata (avoiding duplicates)
  LIST: [
    { code: '+1', country: 'US', flag: '🇺🇸', key: 'us' }, // Primary for +1
    { code: '+44', country: 'GB', flag: '🇬🇧', key: 'gb' },
    { code: '+91', country: 'IN', flag: '🇮🇳', key: 'in' },
    { code: '+86', country: 'CN', flag: '🇨🇳', key: 'cn' },
    { code: '+81', country: 'JP', flag: '🇯🇵', key: 'jp' },
    { code: '+49', country: 'DE', flag: '🇩🇪', key: 'de' },
    { code: '+33', country: 'FR', flag: '🇫🇷', key: 'fr' },
    { code: '+61', country: 'AU', flag: '🇦🇺', key: 'au' },
    { code: '+55', country: 'BR', flag: '🇧🇷', key: 'br' },
    { code: '+7', country: 'RU', flag: '🇷🇺', key: 'ru' },
    { code: '+39', country: 'IT', flag: '🇮🇹', key: 'it' },
    { code: '+34', country: 'ES', flag: '🇪🇸', key: 'es' },
    { code: '+31', country: 'NL', flag: '🇳🇱', key: 'nl' },
    { code: '+41', country: 'CH', flag: '🇨🇭', key: 'ch' },
    { code: '+46', country: 'SE', flag: '🇸🇪', key: 'se' },
    { code: '+47', country: 'NO', flag: '🇳🇴', key: 'no' },
    { code: '+45', country: 'DK', flag: '🇩🇰', key: 'dk' },
    { code: '+358', country: 'FI', flag: '🇫🇮', key: 'fi' },
    { code: '+43', country: 'AT', flag: '🇦🇹', key: 'at' },
    { code: '+32', country: 'BE', flag: '🇧🇪', key: 'be' },
    { code: '+351', country: 'PT', flag: '🇵🇹', key: 'pt' },
    { code: '+353', country: 'IE', flag: '🇮🇪', key: 'ie' },
    { code: '+82', country: 'KR', flag: '🇰🇷', key: 'kr' },
    { code: '+852', country: 'HK', flag: '🇭🇰', key: 'hk' },
    { code: '+65', country: 'SG', flag: '🇸🇬', key: 'sg' },
    { code: '+60', country: 'MY', flag: '🇲🇾', key: 'my' },
    { code: '+66', country: 'TH', flag: '🇹🇭', key: 'th' },
    { code: '+63', country: 'PH', flag: '🇵🇭', key: 'ph' },
    { code: '+62', country: 'ID', flag: '🇮🇩', key: 'id' },
    { code: '+84', country: 'VN', flag: '🇻🇳', key: 'vn' },
    { code: '+886', country: 'TW', flag: '🇹🇼', key: 'tw' },
    { code: '+380', country: 'UA', flag: '🇺🇦', key: 'ua' },
    { code: '+48', country: 'PL', flag: '🇵🇱', key: 'pl' },
    { code: '+27', country: 'ZA', flag: '🇿🇦', key: 'za' },
    { code: '+20', country: 'EG', flag: '🇪🇬', key: 'eg' },
    { code: '+90', country: 'TR', flag: '🇹🇷', key: 'tr' },
    { code: '+971', country: 'AE', flag: '🇦🇪', key: 'ae' },
    { code: '+966', country: 'SA', flag: '🇸🇦', key: 'sa' },
    { code: '+92', country: 'PK', flag: '🇵🇰', key: 'pk' },
    { code: '+880', country: 'BD', flag: '🇧🇩', key: 'bd' },
    { code: '+52', country: 'MX', flag: '🇲🇽', key: 'mx' },
    { code: '+976', country: 'MN', flag: '🇲🇳', key: 'mn' },
  ],

  // Helper functions
  getCountryFromCode: (code: string): string => {
    const entry = Object.entries(COUNTRY_CODES.MAP).find(
      ([, value]) => value === code
    );
    return entry ? entry[0] : 'us'; // Default to US if not found
  },

  getCodeFromCountry: (countryKey: string): string => {
    return (
      COUNTRY_CODES.MAP[countryKey as keyof typeof COUNTRY_CODES.MAP] || '+1'
    );
  },
} as const;

export const JOB_TYPE = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
} as const;

export type JobType = (typeof JOB_TYPE)[keyof typeof JOB_TYPE];

export const ROLE_ID = {
  JOB_USER: 6,
  CONTRACTOR: 3,
} as const;

export enum CommonStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export enum JobFilterType {
  ALL = 'ALL',
  NEED_ATTENTION = 'NEED_ATTENTION',
  NEW_LEADS = 'NEW_LEADS',
  WAITING_ON_CLIENT = 'WAITING_ON_CLIENT',
  ONGOING = 'ONGOING',
}

// Future constants can be added here
// export const OTHER_CONSTANTS = {
//   // Add new constants as needed
// } as const;
