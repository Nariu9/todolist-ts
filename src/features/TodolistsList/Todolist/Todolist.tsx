import React, {FC, memo, useCallback,} from 'react';
import {AddItemForm} from '../../../components/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan';
import {FilterType, TodolistDomainType} from './todolists-reducer';
import {Task} from './Task';
import {TaskStatuses} from '../../../api/todolists-api';
import {useActions, useAppSelector} from '../../../app/hooks';
import {Button, IconButton, List} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {selectTasks} from './Task/taskSelectors';
import {tasksActions} from './Task';
import {todolistsActions} from './index';

type TodolistPropsType = {
    todolist: TodolistDomainType
    demo?: boolean
}


export const Todolist: FC<TodolistPropsType> = memo(({todolist, demo = false}) => {
    console.log('Todolist called')

    let tasks = useAppSelector(selectTasks(todolist.id))
    const {addTask} = useActions(tasksActions)
    const {changeFilter, removeTodolist, changeTodolistTitle} = useActions(todolistsActions)

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
        changeFilter({todolistId: todolist.id, filter: value})
    }, [changeFilter, todolist.id])

    const removeTodolistHandler = () => {
        removeTodolist(todolist.id)
    }

    const addTaskHandler = useCallback((taskTitle: string) => {
        addTask({todolistId: todolist.id, taskTitle})
    }, [addTask, todolist.id])


    const editTodolistTitleHandler = useCallback((newTitle: string) => {
        changeTodolistTitle({todolistId: todolist.id, title: newTitle})
    }, [changeTodolistTitle, todolist.id])

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

    const renderFilterButton = (title: string, buttonFilter: FilterType) => {
        return  <Button size={'small'} variant={'contained'} color={todolist.filter === buttonFilter ? 'secondary' : 'primary'}
                        onClick={() => filterTasksHandler(buttonFilter)}>{title}</Button>
    }

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
                {renderFilterButton('All', 'all')}
                {renderFilterButton('Active', 'active')}
                {renderFilterButton('Completed', 'completed')}
            </div>
        </div>
    );
})