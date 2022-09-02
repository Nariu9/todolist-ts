import React, {ChangeEvent, memo, useCallback} from 'react';
import {removeTasksTC, updateTasksTC} from '../../tasks-reducer';

import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan';
import {TaskStatuses, TaskType} from '../../../../api/todolists-api';
import {useAppDispatch} from '../../../../app/hooks';
import {Checkbox, IconButton, ListItem} from '@mui/material';
import {Delete} from '@mui/icons-material';

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task: React.FC<TaskPropsType> = memo(({task, todolistId}) => {
    const dispatch = useAppDispatch()

    const removeTasksHandler = () => {
        dispatch(removeTasksTC(todolistId, task.id))
    }

    const onChangeCheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTasksTC(todolistId, task.id, {status}))
    }

    const editTaskTitleHandler = useCallback((taskTitle: string) => {
        dispatch(updateTasksTC(todolistId, task.id, {title: taskTitle}))
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