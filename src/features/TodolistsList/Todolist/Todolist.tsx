import React, {memo, useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import {useSelector} from 'react-redux';
import {AppRootStateType} from '../../../app/store';
import {addTasksTC, fetchTasksTC} from '../tasks-reducer';
import {changeFilterAC, changeTodolistTitleTC, FilterType, removeTodolistTC} from '../todolists-reducer';
import {Task} from './Task/Task';
import {TaskStatuses, TaskType} from '../../../api/todolists-api';
import {useAppDispatch} from '../../../app/hooks';
import {Button, IconButton, List} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {RequestStatusType} from '../../../app/app-reducer';

type TodolistUpgradedPropsType = {
    title: string
    filter: FilterType
    todolistId: string
    entityStatus: RequestStatusType
}


export const Todolist: React.FC<TodolistUpgradedPropsType> = memo(({title, filter, todolistId, entityStatus}) => {
    console.log('Todolist called')

    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[todolistId])
    const dispatch = useAppDispatch()

    const isDisabled = entityStatus === 'loading'

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
        dispatch(removeTodolistTC(todolistId))
    }

    const addTaskHandler = useCallback((taskTitle: string) => {
        dispatch(addTasksTC(todolistId, taskTitle))
    }, [dispatch, todolistId])


    const editTodolistTitleHandler = useCallback((newTitle: string) => {
        dispatch(changeTodolistTitleTC(todolistId, newTitle))
    }, [dispatch, todolistId])

    const tasksToRender = tasks && tasks.length
        ? tasks.map(task => <Task key={task.id} task={task} todolistId={todolistId}
                                  disabled={isDisabled}/>)
        : <span>No tasks in this list</span>

    useEffect(() => {
        dispatch(fetchTasksTC(todolistId))
    }, [dispatch, todolistId])

    return (
        <div>
            <h3>
                <EditableSpan value={title} onChange={editTodolistTitleHandler} disabled={isDisabled}/>
                <IconButton onClick={removeTodolistHandler} color={'secondary'} disabled={isDisabled}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskHandler} disabled={isDisabled}/>
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