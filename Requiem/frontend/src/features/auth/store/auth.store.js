import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isSessionChecked: false,

  setUser: (user) => set({ user, isSessionChecked: true }),

  updateUser: (updatedUser) =>
    set((state) => ({ user: { ...state.user, ...updatedUser } })),

  clearAuth: () => set({ user: null, isSessionChecked: true }),
}));


export default useAuthStore;
