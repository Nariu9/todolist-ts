import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {ResultCodes, TaskType, todolistsApi} from '../../api/todolists-api';
import {AppRootStateType, AppThunk} from '../../app/store';
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';


const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK' :
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {
                ...state,
                [action.todolistId]: [{...action.task, entityStatus: 'idle'}, ...state[action.todolistId]]
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            const {[action.id]: remove, ...restState} = {...state}
            return restState
        case 'SET-TODOLISTS':
            const stateCopy = {...state}
            action.todolists.forEach((tl) => stateCopy[tl.id] = [])
            return stateCopy
        /* return action.todolists.reduce((acc, tl) => {
             stateCopy[tl.id] = []
             return stateCopy
         }, {...state})*/
        case 'SET-TASKS':
            return {...state, [action.todolistId]: [...action.tasks].map(t => ({...t, entityStatus: 'idle'}))}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...action.task,
                    entityStatus: 'idle'
                } : t)
            }
        case 'CHANGE-TASK-ENTITY-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    entityStatus: action.status
                } : t)
            }
        default :
            return state
    }
}

// actions
export const removeTaskAC = (todolistId: string, taskId: string) => ({
    type: 'REMOVE-TASK', todolistId, taskId
}) as const
export const addTaskAC = (todolistId: string, task: TaskType) => ({
    type: 'ADD-TASK', todolistId, task
}) as const
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({
    type: 'SET-TASKS', todolistId, tasks
}) as const
export const updateTaskAC = (todolistId: string, taskId: string, task: TaskType) => ({
    type: 'UPDATE-TASK', todolistId, taskId, task
}) as const
export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, status: RequestStatusType) => ({
    type: 'CHANGE-TASK-ENTITY-STATUS', todolistId, taskId, status
}) as const


// thunks
export const fetchTasksTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsApi.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(todolistId, res.data.items))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const addTasksTC = (todolistId: string, taskTitle: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsApi.createTask({todolistId, taskTitle})
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(addTaskAC(todolistId, res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const removeTasksTC = (todolistId: string, taskId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))
    todolistsApi.deleteTask({todolistId, taskId})
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(removeTaskAC(todolistId, taskId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const updateTasksTC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType): AppThunk => (dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))

    const task = getState().tasks[todolistId].find(t => t.id === taskId)

    if (task) {
        todolistsApi.updateTask({todolistId, taskId}, {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...model
        })
            .then((res) => {
                if (res.data.resultCode === ResultCodes.successfully) {
                    dispatch(updateTaskAC(todolistId, taskId, res.data.data.item))
                    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'succeeded'))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data, dispatch)
                    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'))
                }
            })
            .catch((e) => {
                handleServerNetworkError(e, dispatch)
            })
    }
}

// types
type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}

export type TasksStateType = {
    [todolistID: string]: TaskDomainType[]
}

export type TasksActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof changeTaskEntityStatusAC>