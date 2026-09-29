import { useState, useEffect } from "react";

export function useLocalStorage<T> (
    key: string,
    initialValue: T
    ) : [T, (value: T) => void] { // Возврат [T, (value: T) => void] — кортеж как у useState: значение и сеттер.
        const [value, setValue] = useState<T>(() => {
        try{
            const stored = localStorage.getItem(key);
            return stored? (JSON.parse(stored) as T) : initialValue;

        }catch(error){
            console.error(`Ошибка чтения ${key}:`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Ошибка записи ${key}:`, error);
        }
    }, [key, value]);

    return [value, setValue];
}