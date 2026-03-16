import { create } from "zustand";
import { persist } from "zustand/middleware";

// persist middleware automatically saves to localStorage
// so user stays logged in on page refresh

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      updateUser: (updatedUser) =>
        set((state) => ({ user: { ...state.user, ...updatedUser } })),
    }),
    {
      name: "requiem-auth", // localStorage key
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    }
  )
);

export default useAuthStore;
