import React from 'react';
import {FilterType} from './AppWithReduxUpgraded';
import {AddItemForm} from './components/AddItemForm';
import {EditableSpan} from './components/EditableSpan';
import {Button, Checkbox, IconButton, List, ListItem} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from './state/tasks-reducer';
import {changeFilterAC, changeTodolistTitleAC, removeTodolistAC} from './state/todolists-reducer';

type TodolistUpgradedPropsType = {
    title: string
    filter: FilterType
    todolistId: string
}

export type TasksPropsType = {
    id: string
    title: string
    isDone: boolean
}

export const TodolistUpgraded = (props: TodolistUpgradedPropsType) => {

    let tasks = useSelector<AppRootStateType, Array<TasksPropsType>>(state => state.tasks[props.todolistId])
    const dispatch = useDispatch()


    switch (props.filter) {
        case 'Active':
            tasks = tasks.filter(task => !task.isDone)
            break;
        case 'Completed':
            tasks = tasks.filter(task => task.isDone)
            break;
    }

    const filterTasksHandler = (value: FilterType) => {
        return () => dispatch(changeFilterAC(props.todolistId, value))
    }

    const removeTasksHandler = (id: string) => {
        dispatch(removeTaskAC(props.todolistId, id))
    }

    const onChangeCheckboxHandler = (taskId: string, status: boolean) => {
        dispatch(changeTaskStatusAC(props.todolistId, taskId, status))
    }

    const removeTodolistHandler = () => {
        dispatch(removeTodolistAC(props.todolistId))
    }

    const addTaskHandler = (taskTitle: string) => {
        dispatch(addTaskAC(props.todolistId, taskTitle))
    }

    const editTaskTitleHandler = (taskId: string, taskTitle: string) => {
        dispatch(changeTaskTitleAC(props.todolistId, taskId, taskTitle))
    }

    const editTodolistTitleHandler = (newTitle: string) => {
        dispatch(changeTodolistTitleAC(props.todolistId, newTitle))
    }

    const tasksToRender = tasks.length ?
        tasks.map(task => {
                return (
                    <ListItem key={task.id} disableGutters divider className={task.isDone ? 'task isDone' : 'task'}>
                        <Checkbox checked={task.isDone}
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
                <Button size={'small'} variant={'contained'} color={props.filter === 'All' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('All')}>All</Button>
                <Button size={'small'} variant={'contained'} color={props.filter === 'Active' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('Active')}>Active</Button>
                <Button size={'small'} variant={'contained'}
                        color={props.filter === 'Completed' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('Completed')}>Completed</Button>
            </div>
        </div>
    );
}
