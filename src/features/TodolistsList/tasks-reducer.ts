import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsApi} from '../../api/todolists-api';
import {AppThunk, RootState} from '../../app/store';


const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK' :
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {
                ...state,
                [action.todolistId]: [action.task, ...state[action.todolistId]]
            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    status: action.status
                } : t)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    title: action.taskTitle
                } : t)
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
            return {...state, [action.todolistId]: [...action.tasks]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...action.task} : t)
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
export const changeTaskStatusAC = (todolistId: string, taskId: string, status: TaskStatuses) => ({
    type: 'CHANGE-TASK-STATUS', todolistId, taskId, status
}) as const
export const changeTaskTitleAC = (todolistId: string, taskId: string, taskTitle: string) => ({
    type: 'CHANGE-TASK-TITLE', todolistId, taskId, taskTitle
}) as const
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({
    type: 'SET-TASKS', todolistId, tasks
}) as const
export const updateTaskAC = (todolistId: string, taskId: string, task: TaskType) => ({
    type: 'UPDATE-TASK', todolistId, taskId, task
}) as const


// thunks
export const setTasksTC = (todolistId: string): AppThunk => (dispatch) => {
    todolistsApi.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(todolistId, res.data.items))
        })
}
export const addTasksTC = (todolistId: string, taskTitle: string): AppThunk => (dispatch) => {
    todolistsApi.createTask({todolistId, taskTitle})
        .then((res) => {
            dispatch(addTaskAC(todolistId, res.data.data.item))
        })
}
export const removeTasksTC = (todolistId: string, taskId: string): AppThunk => (dispatch) => {
    todolistsApi.deleteTask({todolistId, taskId})
        .then((res) => {
            dispatch(removeTaskAC(todolistId, taskId))
        })
}
export const updateTasksTC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType): AppThunk => (dispatch, getState: () => RootState) => {
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
                dispatch(updateTaskAC(todolistId, taskId, res.data.data.item))
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

export type TasksStateType = {
    [todolistID: string]: TaskType[]
}

export type TasksActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof updateTaskAC>