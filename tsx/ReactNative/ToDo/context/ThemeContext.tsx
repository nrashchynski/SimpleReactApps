import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeStorage } from '../services/storage';
import { darkColors, lightColors, type ThemeColors } from '../theme/colors';

type ThemeContextType = {
    isDarkMode: boolean;
    isReady: boolean;
    colors: ThemeColors;
    toggleTheme: () => void;
    setDarkMode: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        const loadTheme = async () => {
            const storedDarkMode = await ThemeStorage.getDarkMode();
            if (storedDarkMode !== null) {
                setIsDarkMode(storedDarkMode);
            }
            setIsReady(true);
        };
        loadTheme();
    }, []);

    const setDarkMode = (value: boolean) => {
        setIsDarkMode(value);
        ThemeStorage.saveDarkMode(value);
    };

    const toggleTheme = () => {
        setIsDarkMode(prev => {
            const next = !prev;
            ThemeStorage.saveDarkMode(next);
            return next;
        });
    };

    const colors = useMemo(() => (isDarkMode ? darkColors : lightColors), [isDarkMode]);

    const value = useMemo(
        () => ({ isDarkMode, isReady, colors, toggleTheme, setDarkMode }),
        [isDarkMode, isReady, colors],
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
}
