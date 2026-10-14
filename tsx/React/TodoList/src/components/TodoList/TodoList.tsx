import { useState, useEffect } from "react";
import type { Language } from "../../types/index.ts";
import translations from "../../l10n.ts";
import Spinner from "../Spiner/Spiner.tsx";
import "./TodoList.css";

interface TodoListProps {
    tasks: string[];
    setTasks: (tasks: string[]) => void;
    lang: Language;
}

export default function TodoList({tasks, setTasks, lang} : TodoListProps) {
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const url = "https://jsonplaceholder.typicode.com/todos";

    function getData(): void {
        setLoading(true);
        fetch(url)
            .then(response => response.json())
            .then((result : {title: string}[]) => {
                console.log(result);
                const convertedTasks = result.map((res) => res.title);
                setTasks(convertedTasks);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        if (tasks.length === 0) {
            getData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) : void => {
         e.preventDefault();
        const newTasks = [...tasks, text];
        setTasks(newTasks);
        setText("");
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) : void => {
        setText(e.target.value);
    }

    const handleTaskClick = (index: number) : void => {
        const filteredTasks = tasks.filter((el, i) => i != index);
        setTasks(filteredTasks);
    }  


    if (loading) {
        return <Spinner />;
    }
    
    return(
        <form className="todolist" onSubmit={handleSubmit}>
            <div className="todolist__question">
                <b>{translations[lang].question}</b>
            </div>
            <input 
                className="todolist__input"
                type="text" 
                value={text}
                onChange={handleTextChange}
            />
            <ul className="todolist__list">
                {tasks.map((task, index) => {
                    return (
                        <li
                            className="todolist__item"
                            key={task + index}
                        >
                            <span>{task}</span>
                            <button
                                className="todolist__delete-btn"
                                type="button"
                                onClick={() => handleTaskClick(index)}
                            >
                                X
                            </button>
                        </li>
                    );
                })}

            </ul>
        </form>
    )
}