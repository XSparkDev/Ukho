export const ROUTES = {
  AUTH: 'auth',
  TABS_ROOT: '/(tabs)' as const,
  MODAL: 'modal',
} as const;

// App uses Firebase (Auth, Firestore) for clans, profiles, and user data.
// Use clanService, profileService, and authService instead of direct API URLs.
export const API_ROUTES = {
  CLANS: {
    GET_ALL: '/api/clans',
  },
} as const;

