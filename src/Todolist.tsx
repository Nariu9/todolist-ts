import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterType} from "./App";
import {Button} from "./components/Button";

type TodolistPropsType = {
    title?: string | number
    filter: FilterType
    todolistId: string
    tasks: Array<TasksPropsType>
    addTask: (todolistId: string, taskTitle: string) => void
    removeTask: (todolistId: string, id: string) => void
    filterTasks: (todolistId: string, value: FilterType) => void
    changeStatus: (todolistId: string, taskId: string, status: boolean) => void
    removeTodolist: (todolistId: string,) => void
}

export type TasksPropsType = {
    id: string
    title: string
    isDone: boolean
}

export const Todolist = (props: TodolistPropsType) => {

    const [taskTitle, setTaskTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const tasksToRender = props.tasks.length ?
        props.tasks.map(task => {
                return (
                    <li key={task.id} className={task.isDone ? 'isDone' : ''}><input
                        onChange={(event) => onChangeCheckboxHandler(task.id, event.currentTarget.checked)}
                        type="checkbox" checked={task.isDone}/>
                        <Button name={'X'} callback={() => removeTasksHandler(task.id)}/>
                        <span>{task.title}</span>
                    </li>)
            }
        ) : <span>Add some new tasks</span>

    const addTaskHandler = () => {
        if (taskTitle.trim() === '') {
            setError('Title is required')
            setTaskTitle('')
            return
        }
        props.addTask(props.todolistId, taskTitle.trim())
        setTaskTitle('')
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(e.currentTarget.value)
        setError('')
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addTaskHandler()
        }
    }

    const filterTasksHandler = (value: FilterType) => {
        return () => props.filterTasks(props.todolistId, value)
    }

    const removeTasksHandler = (id: string) => {
        props.removeTask(props.todolistId, id)
    }

    const onChangeCheckboxHandler = (taskId: string, status: boolean) => {
        props.changeStatus(props.todolistId, taskId, status)
    }

    const removeTodolistHandler = () => {
        props.removeTodolist(props.todolistId)
    }

    return (
        <div>
            <h3>{props.title}
                <button onClick={removeTodolistHandler}>Del</button>
            </h3>
            <div>
                <input className={error ? 'error' : ''} value={taskTitle} onChange={onChangeHandler}
                       onKeyDown={onKeyDownHandler}/>
                <Button name={'+'} callback={addTaskHandler}/>
                {error && <div className={'errorMessage'}>{error}</div>}
            </div>
            <ul>
                {tasksToRender}
            </ul>
            <div>
                <Button className={props.filter === 'All' ? 'activeFilter' : ''} name={'All'}
                        callback={filterTasksHandler('All')}/>
                <Button className={props.filter === 'Active' ? 'activeFilter' : ''} name={'Active'}
                        callback={filterTasksHandler('Active')}/>
                <Button className={props.filter === 'Completed' ? 'activeFilter' : ''} name={'Completed'}
                        callback={filterTasksHandler('Completed')}/>
            </div>
        </div>
    );
}