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

    const filterTasksHandler = (value:FilterType) => {
        props.filterTasks(value)
    }

    const removeTasksHandler = (id:string) => {
        props.removeTask(id)
    }

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input value={taskTitle} onChange={onChangeHandler} onKeyDown={onKeyDownHandler}/>
                <button onClick={addTaskHandler}>+</button>
            </div>
            <ul>
                {props.tasks.map(task => {
                    return (
                        <li key={task.id}><input type="checkbox" checked={task.isDone}/>
                            <button onClick={()=>removeTasksHandler(task.id)}>X</button> <span>{task.title}</span>
                        </li>)}
                    )
                }

            </ul>
            <div>
                <button onClick={()=>filterTasksHandler('All')}>All</button>
                <button onClick={()=>filterTasksHandler('Active')}>Active</button>
                <button onClick={()=>filterTasksHandler('Completed')}>Completed</button>
            </div>
        </div>
    );
}