import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Task } from '../types/task';
import { TaskStorage } from '../services/storage';
import { parseTaskDate } from './../utils/dateUtils';

type TaskContextType = {
    tasks: Task[],
    isLoading: boolean;
    addTask: (text: string, date: string) => void,
    updateTask: (id: number, text: string, date: string) => void,
    toggleTask: (id: number) => void,
    deleteTask: (id: number) => void,
    sortedTasks: Task[],
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadTasks = async () => {
            const storedTasks = await TaskStorage.getTasks();
            setTasks(storedTasks);
            setIsLoading(false);
        };
        loadTasks();
    }, []);

    const updateAndSaveTasks = (newTasks: Task[]) => {
        setTasks(newTasks);
        TaskStorage.saveTasks(newTasks);
    };

    const addTask = (text: string, date: string) => {
        const newTask: Task = {
            id: Date.now(), 
            task: text,
            completed: false,
            createdAt: date,
        };
        updateAndSaveTasks([...tasks, newTask]);
    };

    const updateTask = (id: number, text: string, date: string) => {
        const updated = tasks.map(task =>
            task.id === id ? { ...task, task: text, createdAt: date } : task
        );
        updateAndSaveTasks(updated);
    };

    const toggleTask = (id: number) => {
        const updated = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        updateAndSaveTasks(updated);
    };

    const deleteTask = (id: number) => {
        const updated = tasks.filter(task => task.id !== id);
        updateAndSaveTasks(updated);
    };

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
        <TaskContext.Provider value={{ tasks, isLoading, addTask, updateTask, toggleTask, deleteTask, sortedTasks }}>
            {children}
        </TaskContext.Provider>
    )
};

export function useTasks() {
    const context = useContext(TaskContext);
    if (!context) throw new Error('useTasks must be used within a TaskProvider');
    return context;
}