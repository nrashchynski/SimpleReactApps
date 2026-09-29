import type { Language } from "../types";

export const LANGUAGES: Language[] = ["eng", "ru"];

export function isLanguage(value: string | null): value is Language {
    return value !== null && LANGUAGES.includes(value as Language);
}