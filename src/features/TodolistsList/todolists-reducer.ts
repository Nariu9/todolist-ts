import {ResultCodes, todolistsAPI, TodolistType} from '../../api/todolists-api';
import {AppThunk} from '../../app/store';
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {fetchTasksTC} from './tasks-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';


const initialState: TodolistDomainType[] = []

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        removeTodolistAC: (state, action: PayloadAction<{ todolistId: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitleAC: (state, action: PayloadAction<{ todolistId: string, title: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.title
        },
        changeFilterAC: (state, action: PayloadAction<{ todolistId: string, filter: FilterType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.filter
        },
        setTodolistsAC: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.entityStatus
        },
        wipeTodolistsDataAC: (state, action: PayloadAction) => {
            return []
        }
    }
})

export const todolistsReducer = slice.reducer
export const {
    removeTodolistAC,
    addTodolistAC,
    changeTodolistTitleAC,
    changeFilterAC,
    setTodolistsAC,
    changeTodolistEntityStatusAC,
    wipeTodolistsDataAC
} = slice.actions

// thunk creators
export const fetchTodolistsTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC({todolists: res.data}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return res.data
        })
        .then((todolists) => {
            todolists.forEach((tl) => dispatch(fetchTasksTC(tl.id)))
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const removeTodolistTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({todolistId, entityStatus: 'loading'}))
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(removeTodolistAC({todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(addTodolistAC({todolist: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({todolistId, entityStatus: 'loading'}))
    todolistsAPI.updateTodolist({todolistId, title})
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(changeTodolistTitleAC({todolistId, title}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(changeTodolistEntityStatusAC({todolistId, entityStatus: 'idle'}))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeTodolistEntityStatusAC({todolistId, entityStatus: 'failed'}))
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