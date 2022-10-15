import React, {ChangeEvent, FC, memo, useCallback} from 'react';
import {TaskDomainType} from './tasks-reducer';
import {EditableSpan} from '../../../../components/EditableSpan';
import {TaskStatuses} from '../../../../api/todolists-api';
import {useActions} from '../../../../app/hooks';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import {Delete} from '@mui/icons-material';
import {tasksActions} from './index';

type TaskPropsType = {
    task: TaskDomainType
    todolistId: string
    disabled: boolean
}
export const Task: FC<TaskPropsType> = memo(({task, todolistId, disabled}) => {
    const {removeTask, updateTasks} = useActions(tasksActions)

    const isDisabled = task.entityStatus === 'loading'

    const removeTasksHandler = useCallback(() => {
        removeTask({todolistId, taskId: task.id})
    }, [removeTask, todolistId, task.id])

    const onChangeCheckboxHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateTasks({
            todolistId,
            taskId: task.id,
            model: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}
        })
    }, [updateTasks, task.id, todolistId])

    const editTaskTitleHandler = useCallback((taskTitle: string) => {
        updateTasks({todolistId, taskId: task.id, model: {title: taskTitle}})
    }, [updateTasks, todolistId, task.id])

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