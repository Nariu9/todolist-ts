import React, {useEffect, useState} from 'react'
import {todolistsApi} from '../api/todolists-api';

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        todolistsApi.getTodolists().then((res) => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState<string>('')

    const createTodolist = () => {
        todolistsApi.createTodolist(title).then((res) => {
            setState(res.data)
        })
        setTitle('')
    }

    return <div> {JSON.stringify(state)}
        <div>
            <input value={title}
                   placeholder={'title'}
                   onChange={(e) => setTitle(e.currentTarget.value)}/>
            <button onClick={createTodolist}>Create todolist</button>
        </div>
    </div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')

    const deleteTodolist = () => {
        todolistsApi.deleteTodolist(todolistId).then((res) => {
            setState(res.data)
        })
        setTodolistId('')
    }

    return <div> {JSON.stringify(state)}
        <div>
            <input value={todolistId}
                   placeholder={'todolistId'}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <button onClick={deleteTodolist}>Delete todolist</button>
        </div>
    </div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [title, setTitle] = useState<string>('')

    const updateTodolist = () => {
        todolistsApi.updateTodolist({todolistId, title}).then((res) => {
            setState(res.data)
        })
        setTodolistId('')
        setTitle('')
    }

    return <div> {JSON.stringify(state)}
        <div>
            <input value={todolistId}
                   placeholder={'todolistId'}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input value={title}
                   placeholder={'newTitle'}
                   onChange={(e) => setTitle(e.currentTarget.value)}/>
            <button onClick={updateTodolist}>Update todolist title</button>
        </div>
    </div>
}


export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')

    const getTasks = () => {
        todolistsApi.getTasks(todolistId).then((res) => {
            setState(res.data)
        })
        setTodolistId('')
    }

    return <div> {JSON.stringify(state)}
        <div>
            <input value={todolistId}
                   placeholder={'todolistId'}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <button onClick={getTasks}>Get tasks</button>
        </div>
    </div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [title, setTitle] = useState<string>('')

    const createTask = () => {
        todolistsApi.createTask({todolistId, taskTitle: title}).then((res) => {
            setState(res.data)
        })
        setTodolistId('')
        setTitle('')
    }

    return <div> {JSON.stringify(state)}
        <div>
            <input value={todolistId}
                   placeholder={'todolistId'}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input value={title}
                   placeholder={'title'}
                   onChange={(e) => setTitle(e.currentTarget.value)}/>
            <button onClick={createTask}>Create task</button>
        </div>
    </div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')

    const deleteTask = () => {
        todolistsApi.deleteTask({todolistId, taskId}).then((res) => {
            setState(res.data)
        })
        setTodolistId('')
        setTaskId('')
    }

    return <div> {JSON.stringify(state)}
        <div>
            <input value={todolistId}
                   placeholder={'todolistId'}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input value={taskId}
                   placeholder={'taskId'}
                   onChange={(e) => setTaskId(e.currentTarget.value)}/>
            <button onClick={deleteTask}>Delete task</button>
        </div>
    </div>
}

export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [status, setStatus] = useState<number>(0)
    const [priority, setPriority] = useState<number>(1)

    const updateTask = () => {
        const data = {
            title,
            description,
            status,
            priority,
            startDate: '',
            deadline: ''
        }
        todolistsApi.updateTask({todolistId, taskId}, data).then((res) => {
            setState(res.data)
        })
        setTodolistId('')
        setTaskId('')
        setTitle('')
        setDescription('')
        setStatus(0)
        setPriority(1)

    }

    return <div> {JSON.stringify(state)}
        <div>
            <input value={todolistId}
                   placeholder={'todolistId'}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input value={taskId}
                   placeholder={'taskId'}
                   onChange={(e) => setTaskId(e.currentTarget.value)}/>
            <input value={title}
                   placeholder={'newTitle'}
                   onChange={(e) => setTitle(e.currentTarget.value)}/>
            <input value={description}
                   placeholder={'description'}
                   onChange={(e) => setDescription(e.currentTarget.value)}/>
            <input value={status}
                   type={'number'}
                   placeholder={'status'}
                   onChange={(e) => setStatus(+e.currentTarget.value)}/>
            <input value={priority}
                   type={'number'}
                   placeholder={'priority'}
                   onChange={(e) => setPriority(+e.currentTarget.value)}/>
            <button onClick={updateTask}>Update task</button>
        </div>
    </div>
}