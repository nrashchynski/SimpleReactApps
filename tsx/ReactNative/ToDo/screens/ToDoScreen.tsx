import { useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from "../components/Header";
import ToDo from '../components/ToDo';

import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import type { ThemeColors } from '../theme/colors';

export default function TodoScreen() {
    const { tasks, isLoading, toggleTask, deleteTask } = useTasks();
    const { colors } = useTheme();

    const styles = useMemo(() => createStyles(colors), [colors]);

    if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        );
    };

    return(
       <SafeAreaView style={styles.container} edges={['top']}>

            <View style={styles.header}>
                <Header />
            </View>

            <View style={styles.toDo}>
                <ToDo tasks={tasks} onToggle={toggleTask} onDelete={deleteTask}/>
            </View>

        </SafeAreaView>
    )
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
        flexDirection: "column",
    },
    header: {
        justifyContent: 'flex-start',
        // backgroundColor: "red"
    },
    toDo: {
        flex: 1,
        justifyContent: 'flex-start',
        alignSelf: "stretch",
    },
})
