import React, {memo, useCallback} from 'react';
import {FilterType} from './AppWithReduxUpgraded';
import {AddItemForm} from './components/AddItemForm';
import {EditableSpan} from './components/EditableSpan';
import {Button, IconButton, List} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {addTaskAC} from './state/tasks-reducer';
import {changeFilterAC, changeTodolistTitleAC, removeTodolistAC} from './state/todolists-reducer';
import {Task} from './components/Task';

type TodolistUpgradedPropsType = {
    title: string
    filter: FilterType
    todolistId: string
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export const TodolistUpgraded: React.FC<TodolistUpgradedPropsType> = memo(({title, filter, todolistId}) => {
    console.log('TodolistUpgraded called')

    let tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[todolistId])
    const dispatch = useDispatch()


    switch (filter) {
        case 'Active':
            tasks = tasks.filter(task => !task.isDone)
            break;
        case 'Completed':
            tasks = tasks.filter(task => task.isDone)
            break;
    }

    const filterTasksHandler = useCallback((value: FilterType) => {
        return () => dispatch(changeFilterAC(todolistId, value))
    }, [dispatch, todolistId])

    const removeTodolistHandler = () => {
        dispatch(removeTodolistAC(todolistId))
    }

    const addTaskHandler = useCallback((taskTitle: string) => {
        dispatch(addTaskAC(todolistId, taskTitle))
    }, [dispatch, todolistId])


    const editTodolistTitleHandler = useCallback((newTitle: string) => {
        dispatch(changeTodolistTitleAC(todolistId, newTitle))
    }, [dispatch, todolistId])

    const tasksToRender = tasks.length
        ? tasks.map(task => <Task key={task.id} task={task} todolistId={todolistId}/>)
        : <span>No tasks in this list</span>

    return (
        <div>
            <h3>
                <EditableSpan value={title} onChange={editTodolistTitleHandler}/>
                <IconButton onClick={removeTodolistHandler} color={'secondary'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskHandler}/>
            <List>
                {tasksToRender}
            </List>
            <div>
                <Button size={'small'} variant={'contained'} color={filter === 'All' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('All')}>All</Button>
                <Button size={'small'} variant={'contained'} color={filter === 'Active' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('Active')}>Active</Button>
                <Button size={'small'} variant={'contained'}
                        color={filter === 'Completed' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('Completed')}>Completed</Button>
            </div>
        </div>
    );
})