import React, {useState} from 'react';
import './App.css';
import {TasksPropsType, Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";

export type FilterType = 'All' | 'Active' | 'Completed'

export type TodolistType = {
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


    const removeTask = (todolistId: string, taskId: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(task => task.id !== taskId)})
    }
    const addTask = (todolistId: string, taskTitle: string) => {
        const newTask = {id: v1(), title: taskTitle, isDone: false}
        setTasks({...tasks, [todolistId]: [newTask, ...tasks[todolistId]]})
    }
    const changeTaskStatus = (todolistId: string, taskId: string, status: boolean) => {
        setTasks({
            ...tasks,
            [todolistId]: tasks[todolistId].map(task => task.id === taskId ? {...task, isDone: status} : task)
        })
    }
    const editTaskTitle = (todolistId: string, taskId: string, taskTitle: string) => {
        setTasks({
            ...tasks,
            [todolistId]: tasks[todolistId].map(task => task.id === taskId ? {...task, title: taskTitle} : task)
        })
    }

    const removeTodolist = (todolistId: string) => {
        setTodolists(todolists.filter(tl => tl.id !== todolistId))
        delete tasks[todolistId]
    }
    const addTodolist = (totolistTitle: string) => {
        const newTodolistId = v1()
        setTodolists([{id: newTodolistId, title: totolistTitle, filter: 'All'}, ...todolists])
        setTasks({...tasks, [newTodolistId]: []})
    }
    const changeTodolistTitle = (todolistId: string, newTitle: string) => {
        setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, title: newTitle} : tl))
    }
    const changeFilter = (todolistId: string, value: FilterType) => {
        setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, filter: value} : tl))
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
            <Grid item key={tl.id}>
                <Paper elevation={3} style={{padding: "20px"}}>
                    <Todolist key={tl.id}
                              title={tl.title}
                              filter={tl.filter}
                              todolistId={tl.id}
                              tasks={filteredTasks}

                              removeTask={removeTask}
                              addTask={addTask}
                              changeTaskStatus={changeTaskStatus}
                              editTaskTitle={editTaskTitle}

                              removeTodolist={removeTodolist}
                              changeFilter={changeFilter}
                              changeTodolistTitle={changeTodolistTitle}/>
                </Paper>
            </Grid>
        )
    })

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <Button color="inherit" variant={"outlined"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px 0 20px 20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolistsToRender}
                </Grid>
            </Container>

        </div>
    );
}


export default App;
