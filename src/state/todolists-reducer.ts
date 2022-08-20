import {v1} from 'uuid';
import {TodolistType} from '../api/todolist-api';

export type removeTodolistAT = {
    type: 'REMOVE-TODOLIST'
    id: string
}

export type addTodolistAT = {
    type: 'ADD-TODOLIST'
    todolistId: string
    title: string
}

export type changeTodolistTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}

export type changeFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterType
}

export type ActionType = removeTodolistAT
    | addTodolistAT
    | changeTodolistTitleAT
    | changeFilterAT

const initialState: TodolistDomainType[] = []

export type FilterType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterType
}

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: ActionType): TodolistDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST' :
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [...state, {id: action.todolistId, title: action.title, filter: 'all', addedDate: '', order: 0}]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        default :
            return state
    }
}

export const removeTodolistAC = (todolistId: string): removeTodolistAT => ({type: 'REMOVE-TODOLIST', id: todolistId})
export const addTodolistAC = (title: string): addTodolistAT => ({type: 'ADD-TODOLIST', todolistId: v1(), title})
export const changeTodolistTitleAC = (todolistId: string, title: string): changeTodolistTitleAT => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id: todolistId,
    title
})
export const changeFilterAC = (todolistId: string, filter: FilterType): changeFilterAT => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id: todolistId,
    filter
})