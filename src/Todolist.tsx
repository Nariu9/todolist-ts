import React from "react";
import {FilterType} from "./App";
import {Button} from "./components/Button";
import {Checkbox} from "./components/Checkbox";
import {AddItemForm} from "./components/AddItemForm";
import {EditableSpan} from "./components/EditableSpan";

type TodolistPropsType = {
    title: string
    filter: FilterType
    todolistId: string
    tasks: Array<TasksPropsType>
    addTask: (todolistId: string, taskTitle: string) => void
    removeTask: (todolistId: string, id: string) => void
    filterTasks: (todolistId: string, value: FilterType) => void
    changeStatus: (todolistId: string, taskId: string, status: boolean) => void
    removeTodolist: (todolistId: string) => void
    editTaskTitle: (todolistId: string, taskId: string, taskTitle: string) => void
    editTodolistTitle: (todolistId: string, newTitle: string) => void
}

export type TasksPropsType = {
    id: string
    title: string
    isDone: boolean
}

export const Todolist = (props: TodolistPropsType) => {

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

    const addTaskHandler = (taskTitle: string) => {
        props.addTask(props.todolistId, taskTitle)
    }

    const editTaskTitleHandler = (taskId: string, taskTitle: string) => {
        props.editTaskTitle(props.todolistId, taskId, taskTitle)
    }

    const editTodolistTitleHandler = (newTitle: string) => {
        props.editTodolistTitle(props.todolistId, newTitle)
    }

    const tasksToRender = props.tasks.length ?
        props.tasks.map(task => {
                return (
                    <li key={task.id} className={task.isDone ? 'isDone' : ''}>
                        <Checkbox checked={task.isDone}
                                  callback={(e) => onChangeCheckboxHandler(task.id, e.currentTarget.checked)}/>
                        <Button name={'X'} callback={() => removeTasksHandler(task.id)}/>
                        <EditableSpan value={task.title} onChange={(text) => editTaskTitleHandler(task.id, text)}/>
                    </li>)
            }
        ) : <span>No tasks in this list</span>

    return (
        <div>
            <h3>
                <EditableSpan value={props.title} onChange={editTodolistTitleHandler}/>
                <button onClick={removeTodolistHandler}>Del</button>
            </h3>
            <AddItemForm addItem={addTaskHandler}/>
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

