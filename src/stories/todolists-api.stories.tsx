import React, {useEffect, useState} from 'react'
import {todolistAPI} from '../api/todolist-api';

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        todolistAPI.getTodolists().then((res) => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title = 'Good Morning'
        todolistAPI.createTodolist(title).then((res) => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '27f22f48-06f7-4a71-a16e-e11289fe9fe1'
        todolistAPI.deleteTodolist(todolistId).then((res) => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '51927ee9-e618-40e5-967c-22c5cd87464a'
        const title = 'Good Job'
        todolistAPI.updateTodolist({todolistId, title}).then((res) => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}


export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        const todolistId = 'f2aa9a32-da02-444d-9d80-059c39e9b37d'
        todolistAPI.getTasks(todolistId).then((res) => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'f2aa9a32-da02-444d-9d80-059c39e9b37d'
        const title = 'Hey'
        todolistAPI.createTask({todolistId, title}).then((res) => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'f2aa9a32-da02-444d-9d80-059c39e9b37d'
        const taskId = 'd748af1b-ee78-476f-a092-54001370ac28'
        todolistAPI.deleteTask({todolistId, taskId}).then((res) => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'f2aa9a32-da02-444d-9d80-059c39e9b37d'
        const taskId = '8f325774-4f3c-4478-a15c-e751b5676d9d'
        const data = {
            title: 'qqqq',
            description: '',
            status: 0,
            priority: 1,
            startDate: '',
            deadline: ''
        }
        todolistAPI.updateTask({todolistId, taskId, data}).then((res) => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}