import Header from "./components/Header/Header.jsx";
import TodoList from "./components/TodoList/TodoList.jsx";
import { useState, useEffect } from "react";
import "./App.css";

const lastLanguage = localStorage.getItem("currentLanguage");

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [lang, setLang] = useState(lastLanguage || "eng");

    useEffect(() => {
        localStorage.setItem("currentLanguage", lang);
    }, [lang]);

    return (
        <div className="app">
            <Header
                amountOfTasks={tasks.length}
                lang={lang}
                setLang={setLang}
            />
            <TodoList
                tasks={tasks}
                setTasks={setTasks}
                lang={lang}
                setLang={setLang}
            />
        </div>
    );
}