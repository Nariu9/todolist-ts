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
    const [error, setError] = useState<string | null>(null)

    const addTaskHandler = () => {
        if (taskTitle.trim() === '') {
            setError('Title is required')
            setTaskTitle('')
            return
        }
        props.addTask(taskTitle.trim())
        setTaskTitle('')
    }

    const onChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(e.currentTarget.value)
        setError('')
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
                <input className={error ? 'error' : ''} value={taskTitle} onChange={onChangeHandler} onKeyDown={onKeyDownHandler}/>
                <Button name={'+'} callback={addTaskHandler}/>
                {error && <div className={'error-message'}>{error}</div>}
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
                <Button className={props.filter === 'All' ? 'active-filter' : ''} name={'All'} callback={()=>filterTasksHandler('All')}/>
                <Button className={props.filter === 'Active' ? 'active-filter' : ''} name={'Active'} callback={()=>filterTasksHandler('Active')}/>
                <Button className={props.filter === 'Completed' ? 'active-filter' : ''} name={'Completed'} callback={()=>filterTasksHandler('Completed')}/>
            </div>
        </div>
    );
}