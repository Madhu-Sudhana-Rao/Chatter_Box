import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ThemeStore = create(
    persist(
        (set) => ({
            theme: 'coffee', 
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'chatterbox-theme', 
        }
    )
);
