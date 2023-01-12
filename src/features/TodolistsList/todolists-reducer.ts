import {ResultCodes, todolistsAPI, TodolistType} from '../../api/todolists-api';
import {AppThunk} from '../../app/store';
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {fetchTasks} from './tasks-sagas';


const initialState: TodolistDomainType[] = []

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: TodolistsActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case 'TODOLISTS/REMOVE-TODOLIST' :
            return state.filter(tl => tl.id !== action.id)
        case 'TODOLISTS/ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'TODOLISTS/CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.todolistId ? {...tl, title: action.title} : tl)
        case 'TODOLISTS/CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter} : tl)
        case 'TODOLISTS/SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case 'TODOLISTS/CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.entityStatus} : tl)
        case 'TODOLISTS/WIPE-TODOLISTS-DATA':
            return []
        default :
            return state
    }
}

// action creators
export const removeTodolistAC = (todolistId: string) => ({type: 'TODOLISTS/REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'TODOLISTS/ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (todolistId: string, title: string) => ({
    type: 'TODOLISTS/CHANGE-TODOLIST-TITLE',
    todolistId,
    title
} as const)
export const changeFilterAC = (todolistId: string, filter: FilterType) => ({
    type: 'TODOLISTS/CHANGE-TODOLIST-FILTER',
    todolistId,
    filter
} as const)
export const setTodolistsAC = (todolists: TodolistType[]) => ({
    type: 'TODOLISTS/SET-TODOLISTS',
    todolists
} as const)
export const changeTodolistEntityStatusAC = (todolistId: string, entityStatus: RequestStatusType) => ({
    type: 'TODOLISTS/CHANGE-TODOLIST-ENTITY-STATUS',
    todolistId,
    entityStatus
} as const)
export const wipeTodolistsDataAC = () => ({type: 'TODOLISTS/WIPE-TODOLISTS-DATA'} as const)


// thunk creators
export const fetchTodolistsTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
            return res.data
        })
        .then((todolists) => {
            todolists.forEach((tl) => dispatch(fetchTasks(tl.id)))
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const removeTodolistTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    todolistsAPI.updateTodolist({todolistId, title})
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(changeTodolistTitleAC(todolistId, title))
                dispatch(setAppStatusAC('succeeded'))
                dispatch(changeTodolistEntityStatusAC(todolistId, 'idle'))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'))
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}

// types
export type TodolistDomainType = TodolistType & {
    filter: FilterType
    entityStatus: RequestStatusType
}
export type FilterType = 'all' | 'active' | 'completed'

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type WipeTodolistsDataActionType = ReturnType<typeof wipeTodolistsDataAC>

export type TodolistsActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeFilterAC>
    | SetTodolistsActionType
    | ReturnType<typeof changeTodolistEntityStatusAC>
    | WipeTodolistsDataActionType