import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task } from '../types/task';
import { INITIAL_TASKS } from '../data/initialTasks';

const TASKS_KEY = '@todo_app_tasks';
const THEME_KEY = '@todo_app_theme';

export const TaskStorage = {
    async getTasks() : Promise<Task[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
            if (jsonValue !== null) {
                return JSON.parse(jsonValue);
            }
            return INITIAL_TASKS;
        } catch(error) {
            console.error('Ошибка при чтении задач из AsyncStorage:', error);
            return INITIAL_TASKS;
        }
    },

    async saveTasks(tasks: Task[]) {
        try {
            const jsonValue = JSON.stringify(tasks);
            await AsyncStorage.setItem(TASKS_KEY, jsonValue);
        } catch(error) {
            console.error('Ошибка при сохранении задач в AsyncStorage:', error);
        }
    }
}

export const ThemeStorage = {
    async getDarkMode(): Promise<boolean | null> {
        try {
            const value = await AsyncStorage.getItem(THEME_KEY);
            return value === null ? null : value === 'true';
        } catch(error) {
            console.error('Ошибка при чтении темы из AsyncStorage:', error);
            return null;
        }
    },

    async saveDarkMode(isDarkMode: boolean) {
        try {
            await AsyncStorage.setItem(THEME_KEY, isDarkMode ? 'true' : 'false');
        } catch(error) {
            console.error('Ошибка при сохранении темы в AsyncStorage:', error);
        }
    }
}