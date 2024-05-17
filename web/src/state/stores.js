import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      auth: false,
      addCredentials: (data) => set((state) => ({ auth: { ...data } })),
      logout: () =>
        set((state) => ({
          auth: {},
        })),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export { useAuthStore };
