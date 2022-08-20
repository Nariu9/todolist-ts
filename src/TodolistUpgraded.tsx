import React, {memo, useCallback} from 'react';
import {AddItemForm} from './components/AddItemForm';
import {EditableSpan} from './components/EditableSpan';
import {Button, IconButton, List} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {addTaskAC} from './state/tasks-reducer';
import {changeFilterAC, changeTodolistTitleAC, FilterType, removeTodolistAC} from './state/todolists-reducer';
import {Task} from './components/Task';
import {TaskStatuses, TaskType} from './api/todolist-api';

type TodolistUpgradedPropsType = {
    title: string
    filter: FilterType
    todolistId: string
}


export const TodolistUpgraded: React.FC<TodolistUpgradedPropsType> = memo(({title, filter, todolistId}) => {
    console.log('TodolistUpgraded called')

    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[todolistId])
    const dispatch = useDispatch()


    switch (filter) {
        case 'active':
            tasks = tasks.filter(t => t.status === TaskStatuses.New)
            break;
        case 'completed':
            tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
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
                <Button size={'small'} variant={'contained'} color={filter === 'all' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('all')}>All</Button>
                <Button size={'small'} variant={'contained'} color={filter === 'active' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('active')}>Active</Button>
                <Button size={'small'} variant={'contained'}
                        color={filter === 'completed' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('completed')}>Completed</Button>
            </div>
        </div>
    );
})