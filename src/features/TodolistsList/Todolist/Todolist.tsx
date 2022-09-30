import React, {FC, memo, useCallback, /*useEffect*/} from 'react';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import {addTaskTC, /*fetchTasksTC*/} from '../tasks-reducer';
import {
    changeFilterAC,
    changeTodolistTitleTC,
    FilterType,
    removeTodolistTC,
    TodolistDomainType
} from '../todolists-reducer';
import {Task} from './Task/Task';
import {TaskStatuses} from '../../../api/todolists-api';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import {Button, IconButton, List} from '@mui/material';
import {Delete} from '@mui/icons-material';

type TodolistPropsType = {
    todolist: TodolistDomainType
    demo?: boolean
}


export const Todolist: FC<TodolistPropsType> = memo(({todolist, demo = false}) => {
    console.log('Todolist called')

    let tasks = useAppSelector(state => state.tasks[todolist.id])
    const dispatch = useAppDispatch()

    const isDisabled = todolist.entityStatus === 'loading'

    switch (todolist.filter) {
        case 'active':
            tasks = tasks.filter(t => t.status === TaskStatuses.New)
            break;
        case 'completed':
            tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
            break;
    }

    const filterTasksHandler = useCallback((value: FilterType) => {
        return () => dispatch(changeFilterAC({todolistId: todolist.id, filter: value}))
    }, [dispatch, todolist.id])

    const removeTodolistHandler = () => {
        dispatch(removeTodolistTC(todolist.id))
    }

    const addTaskHandler = useCallback((taskTitle: string) => {
        dispatch(addTaskTC({todolistId: todolist.id, taskTitle}))
    }, [dispatch, todolist.id])


    const editTodolistTitleHandler = useCallback((newTitle: string) => {
        dispatch(changeTodolistTitleTC(todolist.id, newTitle))
    }, [dispatch, todolist.id])

    const tasksToRender = tasks && tasks.length
        ? tasks.map(task => <Task key={task.id} task={task} todolistId={todolist.id}
                                  disabled={isDisabled}/>)
        : <span>No tasks in this list</span>

    /* useEffect(() => {
         if (demo) {
             return;
         }
         dispatch(fetchTasksTC(todolist.id))
     }, [dispatch, todolist.id, demo])*/

    return (
        <div>
            <h3>
                <EditableSpan value={todolist.title} onChange={editTodolistTitleHandler} disabled={isDisabled}/>
                <IconButton onClick={removeTodolistHandler} color={'secondary'} disabled={isDisabled}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskHandler} disabled={isDisabled}/>
            <List>
                {tasksToRender}
            </List>
            <div>
                <Button size={'small'} variant={'contained'} color={todolist.filter === 'all' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('all')}>All</Button>
                <Button size={'small'} variant={'contained'}
                        color={todolist.filter === 'active' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('active')}>Active</Button>
                <Button size={'small'} variant={'contained'}
                        color={todolist.filter === 'completed' ? 'secondary' : 'primary'}
                        onClick={filterTasksHandler('completed')}>Completed</Button>
            </div>
        </div>
    );
})