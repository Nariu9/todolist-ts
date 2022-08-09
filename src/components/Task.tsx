import React, {memo, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from '../state/tasks-reducer';
import {Checkbox, IconButton, ListItem} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {EditableSpan} from './EditableSpan';
import {TaskType} from '../TodolistUpgraded';

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task: React.FC<TaskPropsType> = memo(({task, todolistId}) => {
    const dispatch = useDispatch()

    const removeTasksHandler = () => {
        dispatch(removeTaskAC(todolistId, task.id))
    }

    const onChangeCheckboxHandler = (status: boolean) => {
        dispatch(changeTaskStatusAC(todolistId, task.id, status))
    }

    const editTaskTitleHandler = useCallback((taskTitle: string) => {
        dispatch(changeTaskTitleAC(todolistId, task.id, taskTitle))
    }, [dispatch, todolistId, task.id])

    return (
        <ListItem disableGutters divider className={task.isDone ? 'task isDone' : 'task'}>
            <Checkbox checked={task.isDone}
                      onChange={(e) => onChangeCheckboxHandler(e.currentTarget.checked)}
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