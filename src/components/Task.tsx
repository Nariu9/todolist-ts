import React, {ChangeEvent, memo, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from '../state/tasks-reducer';
import {Checkbox, IconButton, ListItem} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {EditableSpan} from './EditableSpan';
import {TaskStatuses, TaskType} from '../api/todolist-api';

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task: React.FC<TaskPropsType> = memo(({task, todolistId}) => {
    const dispatch = useDispatch()

    const removeTasksHandler = () => {
        dispatch(removeTaskAC(todolistId, task.id))
    }

    const onChangeCheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(changeTaskStatusAC(todolistId, task.id, status))
    }

    const editTaskTitleHandler = useCallback((taskTitle: string) => {
        dispatch(changeTaskTitleAC(todolistId, task.id, taskTitle))
    }, [dispatch, todolistId, task.id])

    return (
        <ListItem disableGutters divider className={task.status === TaskStatuses.Completed ? 'task isDone' : 'task'}>
            <Checkbox checked={task.status === TaskStatuses.Completed}
                      onChange={onChangeCheckboxHandler}
                      color={'primary'}
                      size={'small'}/>
            <IconButton onClick={removeTasksHandler}
                        color={'secondary'}
                        size={'small'}>
                <Delete fontSize={'small'}/>
            </IconButton>
            <EditableSpan value={task.title} onChange={editTaskTitleHandler}/>
        </ListItem>)
})