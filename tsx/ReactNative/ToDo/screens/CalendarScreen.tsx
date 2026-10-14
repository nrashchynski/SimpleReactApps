// screens/CalendarScreen.tsx
import { StyleSheet, Text, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { useAddTask } from '../context/AddTaskContext';
import type { ThemeColors } from '../theme/colors';
import ToDo from '../components/ToDo';

LocaleConfig.locales['ru'] = {
    monthNames: [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ],
    monthNamesShort: [
        'Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июн.',
        'Июл.', 'Авг.', 'Сент.', 'Окт.', 'Нояб.', 'Дек.'
    ],
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    today: 'Сегодня',
};

LocaleConfig.defaultLocale = 'ru';

export default function CalendarScreen() {

    const { colors, isDarkMode } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const formatDate = (dateString: string): string => {
        const [year, month, day] = dateString.split('-').map(Number);
        const selected = new Date(year, month - 1, day);
        const today = new Date();

        if (
        selected.getDate() === today.getDate() &&
        selected.getMonth() === today.getMonth() &&
        selected.getFullYear() === today.getFullYear()
        ) {
        return 'Сегодня';
        }

        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');
        return `${formattedDay}.${formattedMonth}`;
    };

    const { selectedDate, setSelectedDate } = useAddTask();

    const { sortedTasks, toggleTask, deleteTask } = useTasks();

    const targetTaskDate = formatDate(selectedDate);
    const filteredTasks = sortedTasks.filter(task => task.createdAt === targetTaskDate);

    const calendarTheme = useMemo(() => ({
        calendarBackground: colors.calendarBackground,
        dayTextColor: colors.calendarDayText,
        textDisabledColor: colors.calendarDisabledText,
        textSectionTitleColor: colors.calendarSectionText,
        monthTextColor: colors.calendarMonthText,
        todayTextColor: colors.accent,
        selectedDayBackgroundColor: colors.accent,
        selectedDayTextColor: '#ffffff',
        arrowColor: colors.accent,
    }), [colors]);

    return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.content}>
            <Text style={styles.title}>Календарь</Text>
            <Calendar 
                key={isDarkMode ? 'dark' : 'light'}
                firstDay={1}
                onDayPress={day => setSelectedDate(day.dateString)}
                theme={calendarTheme}
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: colors.accent }
                }}
            />

            <View style={styles.tasksContainer}>
                <Text style={styles.subtitle}>
                    {targetTaskDate}
                </Text>

                { filteredTasks.length > 0 ? (
                    <ToDo 
                        tasks={filteredTasks} 
                        onToggle={toggleTask} 
                        onDelete={deleteTask} 
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>У вас свободный день. Отдыхайте</Text>
                    </View>
                ) }    
            </View>
        </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 35,
    marginBottom: 10,
    color: colors.text,
    // paddingLeft: 25
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 20,
    marginBottom: 10,
  },
  tasksContainer: {
    flex: 1,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
