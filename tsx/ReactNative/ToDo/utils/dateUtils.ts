export const parseTaskDate = (dateStr: string) => {
    if (dateStr === 'Сегодня') {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    }

    const parts = dateStr.split('.');
    if (parts.length != 2) return Infinity;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = new Date().getFullYear();

    const taskDate = new Date(year, month, day);

    return taskDate.getTime();
;}

export const getTodayString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Переводит хранимую строку даты задачи ("Сегодня" | "DD.MM") в формат YYYY-MM-DD,
 * который ожидает календарь и DateTimePicker. Год берётся текущий.
 */
export const taskDateToDateString = (dateStr: string): string => {
    if (dateStr === 'Сегодня') return getTodayString();

    const parts = dateStr.split('.');
    if (parts.length !== 2) return getTodayString();

    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = new Date().getFullYear();
    return `${year}-${month}-${day}`;
};