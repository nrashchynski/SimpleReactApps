import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useMemo } from 'react';

import ToDoScreen from '../screens/ToDoScreen';
import CalendarScreen from '../screens/CalendarScreen';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { useAddTask } from '../context/AddTaskContext';
import AddTaskButton from '../components/AddTaskButton';
import AddTaskModal from '../components/AddTaskModal';
import type { ThemeColors } from '../theme/colors';

export type TabsParamList = {
    ToDo: undefined,
    Calendar: undefined
}

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigation(){
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const { addTask, updateTask } = useTasks();
    const {
        isModalVisible,
        openCreateModal,
        closeModal,
        editingTask,
        modalTitle,
        initialTaskText,
        initialTaskDate,
    } = useAddTask();

    const handleSubmitTask = (text: string, date: string) => {
        if (editingTask) {
            updateTask(editingTask.id, text, date);
        } else {
            addTask(text, date);
        }
    };

    return(
        <View style={styles.tabContainer}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: colors.accent,
                    tabBarInactiveTintColor: colors.textSecondary,
                    tabBarStyle: styles.tabBarStyle,
                    tabBarShowLabel: false,
                    tabBarItemStyle: styles.tabBarItemStyle,
                    sceneStyle: { backgroundColor: colors.background },
                }}
            >
                <Tab.Screen 
                    name="ToDo"
                    component={ToDoScreen}
                    options= {{
                        tabBarIcon: ({color, size}) => (
                            <Ionicons name="checkbox" size={size} color={color} />
                        )
                    }}
                />
                <Tab.Screen
                    name="Calendar" 
                    component={CalendarScreen}
                    options= {{
                        tabBarIcon: ({color, size}) => (
                            <AntDesign name="calendar" size={size} color={color} />
                        )
                    }}
                />
            </Tab.Navigator>

            <AddTaskButton onPress={openCreateModal} />

            <AddTaskModal
                visible={isModalVisible}
                onClose={closeModal}
                onSubmit={handleSubmitTask}
                title={modalTitle}
                initialText={initialTaskText}
                initialDate={initialTaskDate}
            />
        </View>
    )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    tabContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    tabBarStyle: {
        position: "absolute",
        bottom: 20,
        height: 45 ,
        borderRadius: 50,
        marginHorizontal: 70,  
        backgroundColor: colors.tabBar,

        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    }, 
    tabBarItemStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})
