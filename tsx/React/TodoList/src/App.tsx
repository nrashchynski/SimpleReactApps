import Header from "./components/Header/Header.tsx"
import TodoList from "./components/TodoList/TodoList.tsx";
import { useState, useEffect } from "react";
import type {Language} from "./types/index.ts";
import { isLanguage } from "./utils/language.ts";
import { useLocalStorage } from "./hooks/useLocalStorage.ts";
import "./App.css";

const stored = localStorage.getItem("currentLanguage");

export default function App(){
  const [tasks, setTasks] = useLocalStorage<string[]>("tasks", []);
  const [lang, setLang] = useState<Language>(
    isLanguage(stored) ? stored : "eng"
  );

  useEffect(() => {
    localStorage.setItem("currentLanguage", lang);
  }, [lang])

  return(
    <div className = "App">
      <Header
          amountOfTasks={tasks.length}
          lang={lang}
          setLang={setLang}>
      </Header>
      <TodoList
          tasks={tasks}
          setTasks={setTasks}
          lang={lang}>
      </TodoList>

    </div>
  )
}