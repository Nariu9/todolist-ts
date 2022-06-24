import React, {useState} from 'react';
import './App.css';
import {TasksPropsType, Todolist} from './Todolist';
import {v1} from 'uuid';

export type FilterType = 'All' | 'Active' | 'Completed'

type TodolistType = {
    id: string
    title: string
    filter: FilterType
}

type TaskType = {
    [todolistID: string]: Array<TasksPropsType>
}

function App() {

    const todolistID_1 = v1()
    const todolistID_2 = v1()

    const [todolists, setTodolists] = useState<Array<TodolistType>>([
        {id: todolistID_1, title: 'What to learn', filter: 'All'},
        {id: todolistID_2, title: 'What to buy', filter: 'All'},
    ])

    const [tasks, setTasks] = useState<TaskType>({
        [todolistID_1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
            {id: v1(), title: 'Redux', isDone: false}
        ],
        [todolistID_2]: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'Bread', isDone: true},
            {id: v1(), title: 'Honey', isDone: false},
            {id: v1(), title: 'Butter', isDone: false}
        ]
    })


    const addTask = (todolistId: string, taskTitle: string) => {
        const newTask = {id: v1(), title: taskTitle, isDone: false}
        setTasks({...tasks, [todolistId]: [newTask, ...tasks[todolistId]]})
    }

    const removeTask = (todolistId: string, taskId: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(task => task.id !== taskId)})
    }

    const filterTasks = (todolistId: string, value: FilterType) => {
        setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, filter: value} : tl))
    }

    const changeStatus = (todolistId: string, taskId: string, status: boolean) => {
        setTasks({
            ...tasks,
            [todolistId]: tasks[todolistId].map(task => task.id === taskId ? {...task, isDone: status} : task)
        })
    }

    const removeTodolist = (todolistId: string) => {
        setTodolists(todolists.filter(tl => tl.id !== todolistId))
        delete tasks[todolistId]
    }

    const todolistsToRender = todolists.map(tl => {

        let filteredTasks
        switch (tl.filter) {
            case 'Active':
                filteredTasks = tasks[tl.id].filter(task => !task.isDone)
                break;
            case 'Completed':
                filteredTasks = tasks[tl.id].filter(task => task.isDone)
                break;
            default:
                filteredTasks = tasks[tl.id]
                break;
        }

        return (
            <Todolist key={tl.id}
                      title={tl.title}
                      filter={tl.filter}
                      todolistId={tl.id}
                      tasks={filteredTasks}

                      addTask={addTask}
                      removeTask={removeTask}
                      filterTasks={filterTasks}
                      changeStatus={changeStatus}
                      removeTodolist={removeTodolist}/>
        )
    })

    return (
        <div className="App">
            {todolistsToRender}
        </div>
    );
}


export default App;
