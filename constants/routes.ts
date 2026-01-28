export const ROUTES = {
  AUTH: 'auth',
  TABS_ROOT: '/(tabs)' as const,
  MODAL: 'modal',
} as const;

// API endpoints for network services
export const API_ROUTES = {
  CLANS: {
    GET_ALL: 'https://2110000e-d11b-4acc-803c-9d8d776b7411.mock.pstmn.io/Clans',
  },
  PROFILES: {
    BASE: 'https://f9c8f88d-19c7-44f5-9dad-77447928d1e0.mock.pstmn.io',
  },
} as const;

