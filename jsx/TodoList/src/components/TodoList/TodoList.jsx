import translations from "../../l10n";
import { useState, useEffect } from "react";
import "./TodoList.css";

export default function TodoList(props) {
    const { tasks, setTasks, lang, setLang } = props;
    const [text, setText] = useState("");

    const url = "https://jsonplaceholder.typicode.com/todos";

    function getData() {
        fetch(url)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                const convertedTasks = result.map(res => res.title);
                setTasks(convertedTasks);
            });
    }

    useEffect(() => {getData()}, []);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTasks = [...tasks, text];
        setTasks(newTasks);
        setText("");
    };

    const handleTaskClick = (index) => {
        const filteredTasks = tasks.filter((x, i) => i !== index);
        setTasks(filteredTasks);
    };

    return (
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
                        // onClick={() => handleTaskClick(index)}
                        >
                            <span>{task}</span>
                            <button className="todolist__delete-btn" type="button" onClick = {() => handleTaskClick(index)}>X</button>
                        </li>
                       
                    );
                })}
            </ul>
        </form>
    );
}