import { create } from 'zustand';
import { sessionApi } from '../api/sessionApi';

export const useSessionStore = create((set) => ({
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
  error: null,
  isLoading: false,

  login: async (credentials) => {
    const { email, password } = credentials;
    set({ isLoading: true, error: null });
    try {
      const response = await sessionApi.login({ email, password });
      const { token } = response;
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false, user: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false });
      return false;
    }
    try {
      await sessionApi.check();
      set({ isAuthenticated: true });
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      set({ token: null, isAuthenticated: false, user: null });
      return false;
    }
  },
}));
