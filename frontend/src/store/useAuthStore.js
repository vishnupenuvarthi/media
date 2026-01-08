import { create } from 'zustand';

const storageKey = 'bb-auth';

const getPersistedState = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
};

const persistState = (state) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(state));
};

const clearPersistedState = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(storageKey);
};

const initial = getPersistedState();

export const useAuthStore = create((set) => ({
  user: initial?.user ?? null,
  accessToken: initial?.accessToken ?? null,
  refreshToken: initial?.refreshToken ?? null,
  isAuthenticated: Boolean(initial?.accessToken),
  setAuth: ({ user, accessToken, refreshToken }) => {
    const nextState = { user, accessToken, refreshToken };
    persistState(nextState);
    set({ ...nextState, isAuthenticated: true });
  },
  logout: () => {
    clearPersistedState();
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  }
}));

