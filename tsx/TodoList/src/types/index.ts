export type Language = "eng" | "ru";

export interface Translation {
    current: string,
    title: string,
    motivation: string,
    question: string,
}

export type Translations = Record<Language, Translation>;

export interface Task {
    id: number;
    title: string;
    completed: boolean;
}

export interface TodoApiResponse {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}