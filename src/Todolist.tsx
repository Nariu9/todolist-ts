import React, {ChangeEvent,KeyboardEvent, useState} from "react";
import {FilterType} from "./App";

type TodolistPropsType = {
    title?: string | number
    tasks: Array<TasksPropsType>
    removeTask:(id:string)=>void
    filterTasks:(value:FilterType)=>void
    addTask:(taskTitle:string)=>void
}

export type TasksPropsType = {
    id: string
    title: string
    isDone: boolean
}

export const Todolist = (props: TodolistPropsType) => {

    const [taskTitle, setTaskTitle] = useState('')

    const addTaskHandler = () => {
        if (taskTitle) {
            props.addTask(taskTitle)
        }
        setTaskTitle('')
    }

    const onChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(e.currentTarget.value)
    }

    const onKeyDownHandler = (e:KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addTaskHandler()
        }
    }

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input value={taskTitle} onChange={onChangeHandler} onKeyDown={onKeyDownHandler}/>
                <button onClick={addTaskHandler}>+</button>
            </div>
            <ul>
                {props.tasks.map(el =>
                    <li key={el.id}><input type="checkbox" checked={el.isDone}/>
                        <button onClick={()=>props.removeTask(el.id)}>X</button> <span>{el.title}</span>
                    </li>)}
            </ul>
            <div>
                <button onClick={()=>props.filterTasks('All')}>All</button>
                <button onClick={()=>props.filterTasks('Active')}>Active</button>
                <button onClick={()=>props.filterTasks('Completed')}>Completed</button>
            </div>
        </div>
    );
}