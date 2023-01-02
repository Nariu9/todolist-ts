import React, {FC, memo, useCallback,} from 'react';
import {FilterType, TodolistDomainType} from './todolists-reducer';
import {tasksActions} from './Task';
import {TaskStatuses} from '../../../api/todolists-api';
import {useActions, useAppSelector} from '../../../common/hooks/hooks';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import {Delete} from '@mui/icons-material';
import {selectTasks} from './Task/taskSelectors';
import {todolistsActions} from './index';
import {Task} from './Task/Task';
import {AddItemForm} from '../../../common/components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../common/components/EditableSpan/EditableSpan';

type TodolistPropsType = {
    todolist: TodolistDomainType
    demo?: boolean
}


export const Todolist: FC<TodolistPropsType> = memo(({todolist, demo = false}) => {

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
        : <div style={{padding: '10px', color: '#9c9c9c'}}>No tasks in this list</div>

    /* useEffect(() => {
         if (demo) {
             return;
         }
         dispatch(fetchTasksTC(todolist.id))
     }, [dispatch, todolist.id, demo])*/

    const renderFilterButton = (title: string, buttonFilter: FilterType) => {
        return <Button size={'small'} variant={'contained'}
                       color={todolist.filter === buttonFilter ? 'secondary' : 'primary'}
                       onClick={() => filterTasksHandler(buttonFilter)}>{title}</Button>
    }

    return (
        <Paper elevation={3} style={{padding: '20px', margin: '5px', position: 'relative'}}>
            <h3 style={{wordWrap: 'break-word'}}>
                <EditableSpan value={todolist.title} onChange={editTodolistTitleHandler} disabled={isDisabled}/>
                <IconButton onClick={removeTodolistHandler} color={'secondary'} disabled={isDisabled}
                            style={{position: 'absolute', right: '5px', top: '5px'}}>
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
        </Paper>
    );
})