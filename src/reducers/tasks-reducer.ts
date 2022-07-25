import {TasksStateType} from '../App';
import {v1} from 'uuid';
import {addTodolistAT, removeTodolistAT} from './todolists-reducer';

export type removeTasksAT = ReturnType<typeof removeTaskAC>
export type addTaskAT = ReturnType<typeof addTaskAC>
export type changeTaskStatusAT = ReturnType<typeof changeTaskStatusAC>
export type changeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>

export type ActionType = removeTasksAT
    | addTaskAT
    | changeTaskStatusAT
    | changeTaskTitleAT
    | addTodolistAT
    | removeTodolistAT


export const tasksReducer = (state: TasksStateType, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK' :
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {
                ...state,
                [action.todolistId]: [{id: v1(), title: action.taskTitle, isDone: false}, ...state[action.todolistId]]
            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    isDone: action.status
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
            return {...state, [action.todolistId]: []}
        case 'REMOVE-TODOLIST':
            const {[action.id]: remove, ...restState} = {...state}
            return restState
        default :
            return state
    }
}

export const removeTaskAC = (todolistId: string, taskId: string) => ({
    type: 'REMOVE-TASK', todolistId, taskId
}) as const
export const addTaskAC = (todolistId: string, taskTitle: string) => ({
    type: 'ADD-TASK', todolistId, taskTitle
}) as const
export const changeTaskStatusAC = (todolistId: string, taskId: string, status: boolean) => ({
    type: 'CHANGE-TASK-STATUS', todolistId, taskId, status
}) as const
export const changeTaskTitleAC = (todolistId: string, taskId: string, taskTitle: string) => ({
    type: 'CHANGE-TASK-TITLE', todolistId, taskId, taskTitle
}) as const
