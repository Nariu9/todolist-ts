import axios, {AxiosResponse} from 'axios';


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'api-key': 'a3decdb3-48b2-455e-b07a-b72b7d94ecdb'
    }
})

// API
export const todolistsApi = {
    getTodolists() {
        return instance.get<'', AxiosResponse<TodolistType[]>, {}>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<'', AxiosResponse<ResponseType<{ item: TodolistType }>>, { title: string }>('todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<'', AxiosResponse<ResponseType>, {}>(`todo-lists/${todolistId}`)
    },
    updateTodolist(p: { todolistId: string, title: string }) {
        return instance.put<'', AxiosResponse<ResponseType>, { title: string }>(`todo-lists/${p.todolistId}`, {title: p.title})
    },
    getTasks(todolistId: string) {
        return instance.get<'', AxiosResponse<GetTasksType>, {}>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(p: { todolistId: string, taskTitle: string }) {
        return instance.post<'', AxiosResponse<ResponseType<{ item: TaskType }>>, { title: string }>(`todo-lists/${p.todolistId}/tasks`, {title: p.taskTitle})
    },
    deleteTask(p: { todolistId: string, taskId: string }) {
        return instance.delete<'', AxiosResponse<ResponseType>, {}>(`todo-lists/${p.todolistId}/tasks/${p.taskId}`)
    },
    updateTask(p: { todolistId: string, taskId: string }, data: UpdateTaskModelType) {
        return instance.put<'', AxiosResponse<ResponseType<{ item: TaskType }>>, UpdateTaskModelType>(`todo-lists/${p.todolistId}/tasks/${p.taskId}`, {...data})
    }
}

// types
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type ResponseType<T = {}> = {
    data: T
    messages: string[]
    fieldsErrors: string[]
    resultCode: number
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export enum ResultCodes {
    successfully = 0,
    error = 1,
    captcha_required = 10
}

export type TaskType = {
    id: string
    title: string
    description: string
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    addedDate: string
}
type GetTasksType = {
    items: TaskType[]
    totalCount: number
    error: string
}
type UpdateTaskModelType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}