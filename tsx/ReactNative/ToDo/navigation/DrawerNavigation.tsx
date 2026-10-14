import { StyleSheet, View, Text, Switch } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo } from 'react';

import { useTheme } from '../context/ThemeContext';
import TabsNavigation from './TabsNavigation';
import type { ThemeColors } from '../theme/colors';

export type DrawerParamList = {
  Tabs: undefined,
}

const Drawer = createDrawerNavigator<DrawerParamList>();

function CustomDrawerContent(props: DrawerContentComponentProps){
    const { colors, isDarkMode, setDarkMode } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return(
        <DrawerContentScrollView
            {...props}
            style={styles.drawerScroll}
            contentContainerStyle={styles.drawerScrollContainer}
        >
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.themeContainer}>
                    <Text style={styles.themeText}>Тёмная тема</Text>
                    <Switch 
                        value={isDarkMode} 
                        onValueChange={setDarkMode} 
                        trackColor={{ false: '#767577', true: colors.accent }}
                    />
                </View>
            </SafeAreaView>
        </DrawerContentScrollView>
    )
}

export default function DrawerNavigation() {
    const { colors } = useTheme();

    return(
        <Drawer.Navigator 
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{ 
                headerTitle: '',
                headerTransparent: true,
                drawerStyle: { backgroundColor: colors.drawer },
                sceneStyle: { backgroundColor: colors.background },
            }}
        >
            <Drawer.Screen 
                name="Tabs" 
                component={TabsNavigation} 
                options={{ headerTitle: '' }} 
            />
        </Drawer.Navigator>
    )
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    themeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    themeText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    drawerScroll: {
        backgroundColor: colors.drawer,
    },
    drawerScrollContainer: {
        flex: 1,
        paddingTop: 0,
        backgroundColor: colors.drawer,
    },
    safeArea: {
        flex: 1,
        marginTop: 20, 
    },
})
