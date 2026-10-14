import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-gesture-handler';

import AppNavigator from './navigation/AppNavigator';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AddTaskProvider } from './context/AddTaskContext';

function ThemedApp() {
    const { isDarkMode, isReady, colors } = useTheme();

    if (!isReady) {
        return <View style={{ flex: 1, backgroundColor: colors.background }} />;
    }

    return (
        <TaskProvider>
            <AddTaskProvider>
                <AppNavigator />
                <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            </AddTaskProvider>
        </TaskProvider>
    );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
            <ThemedApp />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
