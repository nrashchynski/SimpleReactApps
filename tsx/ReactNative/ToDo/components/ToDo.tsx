import { Text, StyleSheet, View, FlatList, Pressable } from "react-native";
import { useMemo } from "react";
import {Swipeable} from "react-native-gesture-handler";
import type { Task } from './../types/task';
import {parseTaskDate} from './../utils/dateUtils';
import { useTheme } from '../context/ThemeContext';
import { useAddTask } from '../context/AddTaskContext';
import type { ThemeColors } from '../theme/colors';

type ToDoProps = {
    tasks: Task[],
    onToggle: (id: number) => void,
    onDelete: (id: number) => void,
}

export default function ToDo({tasks, onToggle, onDelete} : ToDoProps) {

    const { colors } = useTheme();
    const { openEditModal } = useAddTask();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const renderLeftActions = (id: number, completed: boolean) => (
        <Pressable 
            style={[styles.actionButton, styles.completeButton]} 
            onPress={() => onToggle(id)}
        >
            <Text style={styles.actionText}>
                {completed ? 'Вернуть' : 'Готово'}
            </Text>
        </Pressable>
    );

    const renderRightActions = (id: number) => (
        <Pressable 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={() => onDelete(id)}
        >
            <Text style={styles.actionText}>Удалить</Text>
        </Pressable>
    );

    const getDateColor = (dateStr: string): string => {
        if (dateStr === 'Сегодня') {
            return colors.future;
        }

        const parts = dateStr.split('.');
        if (parts.length !== 2) return colors.text;

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;

        const now = new Date();
        const currentYear = now.getFullYear();

        const taskDate = new Date(currentYear, month, day);

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        if (taskDate < today) {
            return colors.past;
        }

        return colors.future;
    }

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {

            if(a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }

            const dateA = parseTaskDate(a.createdAt);
            const dateB = parseTaskDate(b.createdAt);
            return dateA - dateB;
        });
    }, [tasks]);

    
    return(
        <View style={styles.container}>
            <FlatList 
                data={sortedTasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <Swipeable 
                        renderLeftActions={() => renderLeftActions(item.id, item.completed)}
                        onSwipeableOpen={(direction) => {
                            if (direction === 'left') {
                                onToggle(item.id);
                            } else if (direction === 'right') {
                                onDelete(item.id);
                            }
                        }} 
                        renderRightActions={() => renderRightActions(item.id)}
                    >

                        <View style={styles.liCont}>
                            <View style={{flexDirection: "row", alignItems: 'center', flex: 1}}>
                                <Pressable 
                                    onPress={() => onToggle(item.id)}
                                    disabled={item.completed}
                                >
                                    <View style={[styles.checkBox, item.completed && styles.checkBoxCompleted]}>
                                        {item.completed && <Text style={styles.checkMark}>✓</Text>}
                                    </View>
                                </Pressable>

                                <Pressable
                                    style={styles.taskPressable}
                                    onPress={() => openEditModal(item)}
                                >
                                    <Text style={[styles.liText, item.completed && styles.completedText]}>
                                        {item.task}
                                    </Text>
                                </Pressable>
                            </View>
                            <Text style={[styles.dateText, { color: getDateColor(item.createdAt) }]}>{item.createdAt}</Text>
                        </View>

                    </Swipeable>
                )}            
            />
        </View>
    )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,  

    },
    actionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        marginVertical: 5,
        borderRadius: 3,
    },
    deleteButton: {
        backgroundColor: 'red',
        marginRight: 20,
    },
    completeButton: {
        backgroundColor: 'green',
        marginLeft: 20,
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
    },
    deleteText: {
        color: 'white',
        fontWeight: 'bold',
    },
    liCont: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: colors.border,
        borderWidth: 1.5,
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 20,
        alignSelf: 'stretch',
        backgroundColor: colors.card,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: colors.completed,
    },
    checkBoxCompleted: {
        backgroundColor: colors.checkmarkBackground,
        borderColor: colors.checkmarkBackground,
        opacity: 0.7,
    },
    checkMark: {
        color: 'white',          
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: -2,           
    },
    checkBox: {
        width: 22,
        height: 22,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: 7,
        marginLeft: 5,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    taskPressable: {
        flex: 1,
        flexShrink: 1,
        justifyContent: 'center',
    },
    liText: {
        fontSize: 14,
        fontWeight: "700",
        marginVertical: 10,
        padding: 5, // между текстом и рамкой
        color: colors.text,
    },
    dateText: {
        flexShrink: 0,
        fontSize: 13,
        fontWeight: "600",
        color: colors.textSecondary,
        marginLeft: 8,
        marginRight: 5,
    }

});