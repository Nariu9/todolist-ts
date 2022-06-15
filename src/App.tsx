import React, {useState} from 'react';
import './App.css';
import {TasksPropsType, Todolist} from "./Todolist";
import {v1} from "uuid";

export type FilterType = 'All' | 'Active' | 'Completed'

function App() {

    let [tasks, setTasks] = useState<Array<TasksPropsType>>([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false},
        {id: v1(), title: "Redux", isDone: false}
    ])

    const changeStatus = (taskId: string, status: boolean) => {
        setTasks(tasks.map(task => task.id === taskId ? {...task, isDone: status} : task))
    }

    const addTask = (taskTitle: string) => {
        const newTask = {id: v1(), title: taskTitle, isDone: false}
        const newTasks = [newTask, ...tasks]
        setTasks(newTasks)
    }

    const removeTask = (id: string) => {
        tasks = tasks.filter(task => task.id !== id)
        setTasks(tasks)
    }

    const [filter, setFilter] = useState<FilterType>('All')

    let filteredTasks = tasks
    if (filter === 'Active') {
        filteredTasks = tasks.filter(task => !task.isDone)
    } else if (filter === 'Completed') {
        filteredTasks = tasks.filter(task => task.isDone)
    }

    const filterTasks = (value: FilterType) => {
        setFilter(value)
    }

    return (
        <div className="App">
            <Todolist title={"What to learn"}
                      tasks={filteredTasks}
                      removeTask={removeTask}
                      filterTasks={filterTasks}
                      addTask={addTask}
                      changeStatus={changeStatus}
                      filter={filter}/>
        </div>
    );
}


export default App;
