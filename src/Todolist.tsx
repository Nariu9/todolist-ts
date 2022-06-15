import React, {ChangeEvent,KeyboardEvent, useState} from "react";
import {FilterType} from "./App";
import {Button} from "./components/Button";

type TodolistPropsType = {
    title?: string | number
    tasks: Array<TasksPropsType>
    removeTask:(id:string)=>void
    filterTasks:(value:FilterType)=>void
    addTask:(taskTitle:string)=>void
    changeStatus:(taskId: string, status: boolean)=>void
    filter:FilterType
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

    const onChangeCheckboxHandler = (taskId:string, status:boolean) => {
        props.changeStatus(taskId, status)
    }

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input value={taskTitle} onChange={onChangeHandler} onKeyDown={onKeyDownHandler}/>
                <Button name={'+'} callback={addTaskHandler}/>
            </div>
            <ul>
                {props.tasks.map(task => {
                    return (
                        <li key={task.id}><input onChange={(event)=>onChangeCheckboxHandler(task.id, event.currentTarget.checked)} type="checkbox" checked={task.isDone}/>
                            <Button name={'X'} callback={()=>removeTasksHandler(task.id)}/>
                            <span>{task.title}</span>
                        </li>)}
                    )
                }

            </ul>
            <div>
                <Button name={'All'} callback={()=>filterTasksHandler('All')}/>
                <Button name={'Active'} callback={()=>filterTasksHandler('Active')}/>
                <Button name={'Completed'} callback={()=>filterTasksHandler('Completed')}/>
            </div>
        </div>
    );
}