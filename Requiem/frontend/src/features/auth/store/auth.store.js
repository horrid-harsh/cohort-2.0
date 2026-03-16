import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  updateUser: (updatedUser) =>
    set((state) => ({ user: { ...state.user, ...updatedUser } })),

  clearAuth: () => set({ user: null }),
}));


export default useAuthStore;
