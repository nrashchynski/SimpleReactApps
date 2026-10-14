import { createContext, useContext, useMemo, useState } from 'react';
import type { Task } from '../types/task';
import { getTodayString, taskDateToDateString } from '../utils/dateUtils';

type AddTaskContextType = {
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    isModalVisible: boolean;
    modalTitle: string;
    initialTaskText: string;
    initialTaskDate: string;
    editingTask: Task | null;
    openCreateModal: () => void;
    openEditModal: (task: Task) => void;
    closeModal: () => void;
};

const AddTaskContext = createContext<AddTaskContextType | undefined>(undefined);

export function AddTaskProvider({ children }: { children: React.ReactNode }) {
    const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const openCreateModal = () => {
        setEditingTask(null);
        setModalVisible(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const value = useMemo(
        () => ({
            selectedDate,
            setSelectedDate,
            isModalVisible,
            modalTitle: editingTask ? 'Редактировать задачу' : 'Новая задача',
            initialTaskText: editingTask?.task ?? '',
            initialTaskDate: editingTask
                ? taskDateToDateString(editingTask.createdAt)
                : selectedDate,
            editingTask,
            openCreateModal,
            openEditModal,
            closeModal,
        }),
        [selectedDate, isModalVisible, editingTask],
    );

    return (
        <AddTaskContext.Provider value={value}>
            {children}
        </AddTaskContext.Provider>
    );
}

export function useAddTask() {
    const context = useContext(AddTaskContext);
    if (!context) throw new Error('useAddTask must be used within an AddTaskProvider');
    return context;
}
