import React, {ChangeEvent, memo, useCallback} from 'react';
import {removeTaskTC, TaskDomainType, updateTasksTC} from '../../tasks-reducer';
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan';
import {TaskStatuses} from '../../../../api/todolists-api';
import {useAppDispatch} from '../../../../app/hooks';
import {Checkbox, IconButton, ListItem} from '@mui/material';
import {Delete} from '@mui/icons-material';

type TaskPropsType = {
    task: TaskDomainType
    todolistId: string
    disabled: boolean
}
export const Task: React.FC<TaskPropsType> = memo(({task, todolistId, disabled}) => {
    const dispatch = useAppDispatch()

    const isDisabled = task.entityStatus === 'loading'

    const removeTasksHandler = () => {
        dispatch(removeTaskTC({todolistId, taskId: task.id}))
    }

    const onChangeCheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTasksTC({todolistId, taskId: task.id, model: {status}}))
    }

    const editTaskTitleHandler = useCallback((taskTitle: string) => {
        dispatch(updateTasksTC({todolistId, taskId: task.id, model: {title: taskTitle}}))
    }, [dispatch, todolistId, task.id])

    return (
        <ListItem disableGutters divider className={task.status === TaskStatuses.Completed ? 'task isDone' : 'task'}>
            <Checkbox checked={task.status === TaskStatuses.Completed}
                      onChange={onChangeCheckboxHandler}
                      color={'primary'}
                      size={'small'}
                      disabled={isDisabled}/>
            <IconButton onClick={removeTasksHandler}
                        color={'secondary'}
                        size={'small'}
                        disabled={isDisabled}>
                <Delete fontSize={'small'}/>
            </IconButton>
            <EditableSpan value={task.title} onChange={editTaskTitleHandler}
                          disabled={disabled || isDisabled}/>
        </ListItem>)
})