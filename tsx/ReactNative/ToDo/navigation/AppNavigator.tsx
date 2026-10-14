import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useMemo } from 'react';

import DrawerNavigation from './DrawerNavigation';
import { useTheme } from '../context/ThemeContext';

export type { DrawerParamList } from './DrawerNavigation';
export type { TabsParamList } from './TabsNavigation';

export default function AppNavigator() {
    const { isDarkMode, colors } = useTheme();

    const navigationTheme = useMemo(() => {
        const base = isDarkMode ? DarkTheme : DefaultTheme;
        return {
            ...base,
            dark: isDarkMode,
            colors: {
                ...base.colors,
                primary: colors.accent,
                background: colors.background,
                card: colors.drawer,
                text: colors.text,
                border: colors.border,
                notification: colors.accent,
            },
        };
    }, [isDarkMode, colors]);

    return(
        <NavigationContainer theme={navigationTheme}>
            <DrawerNavigation />
        </NavigationContainer>
    )
};
