/*
import React from 'react';
import {AddItemForm} from '../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../components/EditableSpan/EditableSpan';
import {Button, Checkbox, IconButton, List, ListItem} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {TaskStatuses, TaskType} from '../api/todolists-api';
import {FilterType} from '../features/TodolistsList/todolists-reducer';

type TodolistPropsType = {
    title: string
    filter: FilterType
    todolistId: string
    tasks: TaskType[]
    addTask: (todolistId: string, taskTitle: string) => void
    removeTask: (todolistId: string, id: string) => void
    changeFilter: (todolistId: string, value: FilterType) => void
    changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
    removeTodolist: (todolistId: string) => void
    changeTaskTitle: (todolistId: string, taskId: string, taskTitle: string) => void
    changeTodolistTitle: (todolistId: string, newTitle: string) => void
}

export const Todolist = (props: TodolistPropsType) => {

    const filterTasksHandler = (value: FilterType) => {
        return () => props.changeFilter(props.todolistId, value)
    }

    const removeTasksHandler = (id: string) => {
        props.removeTask(props.todolistId, id)
    }

    const onChangeCheckboxHandler = (taskId: string, checked: boolean) => {
        const status = checked ? TaskStatuses.Completed : TaskStatuses.New
        props.changeTaskStatus(props.todolistId, taskId, status)
    }

    const removeTodolistHandler = () => {
        props.removeTodolist(props.todolistId)
    }

    const addTaskHandler = (taskTitle: string) => {
        props.addTask(props.todolistId, taskTitle)
    }

    const editTaskTitleHandler = (taskId: string, taskTitle: string) => {
        props.changeTaskTitle(props.todolistId, taskId, taskTitle)
    }

    const editTodolistTitleHandler = (newTitle: string) => {
        props.changeTodolistTitle(props.todolistId, newTitle)
    }

    const tasksToRender = props.tasks.length ?
        props.tasks.map(task => {
                return (
                    <ListItem key={task.id} disableGutters divider
                              className={task.status === TaskStatuses.Completed ? 'task isDone' : 'task'}>
                        <Checkbox checked={task.status === TaskStatuses.Completed}
                                  onChange={(e) => onChangeCheckboxHandler(task.id, e.currentTarget.checked)}
                                  color={'primary'}
                                  size={'small'}/>
                        <IconButton onClick={() => removeTasksHandler(task.id)}
                                    color={'secondary'}
                                    size={'small'}>
                            <Delete fontSize={'small'}/>
                        </IconButton>
                        <EditableSpan value={task.title} onChange={(text) => editTaskTitleHandler(task.id, text)}/>
                    </ListItem>)
            }
        ) : <span>No tasks in this list</span>

    return (
        <div>
            <h3>
                <EditableSpan value={props.title} onChange={editTodolistTitleHandler}/>
                <IconButton onClick={removeTodolistHandler} color={'secondary'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskHandler}/>
            <List>
                {tasksToRender}
            </List>
            <div>
                <Button size={'small'} variant={'contained'} color={props.filter === 'all' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('all')}>All</Button>
                <Button size={'small'} variant={'contained'} color={props.filter === 'active' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('active')}>Active</Button>
                <Button size={'small'} variant={'contained'}
                        color={props.filter === 'completed' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('completed')}>Completed</Button>
            </div>
        </div>
    );
}
*/

let d = 15
export default d