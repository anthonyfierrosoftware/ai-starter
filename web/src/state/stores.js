import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as themeObjects from "../theme";

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

const themes = { ...themeObjects };
const themeKeys = Object.keys(themes);

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: themes.defaultTheme,
      currentThemeIndex: 0,
      setTheme: (themeName) => {
        const theme = themes[themeName] || themes.defaultTheme;
        set({ theme, currentThemeIndex: themeKeys.indexOf(themeName) });
      },
      toggleTheme: () => {
        const { currentThemeIndex } = get();
        const nextThemeIndex = (currentThemeIndex + 1) % themeKeys.length;
        const nextThemeName = themeKeys[nextThemeIndex];
        set({
          theme: themes[nextThemeName],
          currentThemeIndex: nextThemeIndex,
        });
      },
    }),
    {
      name: "theme-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // use localStorage to persist the theme
    }
  )
);

export { useAuthStore, useThemeStore };
