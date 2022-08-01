import React, {useReducer, useState} from 'react';
import './App.css';
import {TasksPropsType, Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from './components/AddItemForm';
import {
    AppBar,
    Button,
    Container,
    createTheme,
    CssBaseline,
    Grid,
    IconButton,
    Paper, ThemeProvider,
    Toolbar,
    Typography
} from '@material-ui/core';
import {Brightness4, BrightnessHigh, Menu} from '@material-ui/icons';
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from './state/todolists-reducer';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from './state/tasks-reducer';

export type FilterType = 'All' | 'Active' | 'Completed'

export type TodolistType = {
    id: string
    title: string
    filter: FilterType
}

export type TasksStateType = {
    [todolistID: string]: Array<TasksPropsType>
}

function AppWithReducers() {

    //color theme logic

    const [mode, setMode] = useState<'dark' | 'light'>('dark')
    const theme = createTheme({
        palette: {
            primary: {
                light: '#69d2f9',
                main: '#27a1c6',
                dark: '#007295',
                contrastText: '#fff',
            },
            secondary: {
                light: '#ffffae',
                main: '#ffde7d',
                dark: '#caac4e',
                contrastText: '#000',
            },
            type: mode
        }
    })
    const toggleColorMode = () => {
        setMode(mode === 'light' ? 'dark' : 'light')
    }

    //BLL

    const todolistID_1 = v1()
    const todolistID_2 = v1()

    const [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todolistID_1, title: 'What to learn', filter: 'All'},
        {id: todolistID_2, title: 'What to buy', filter: 'All'},
    ])

    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
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
        //setTasks({...tasks, [todolistId]: tasks[todolistId].filter(task => task.id !== taskId)})
        dispatchToTasks(removeTaskAC(todolistId, taskId))
    }
    const addTask = (todolistId: string, taskTitle: string) => {
        /*const newTask = {id: v1(), title: taskTitle, isDone: false}
        setTasks({...tasks, [todolistId]: [newTask, ...tasks[todolistId]]})*/
        dispatchToTasks(addTaskAC(todolistId, taskTitle))
    }
    const changeTaskStatus = (todolistId: string, taskId: string, status: boolean) => {
        /*setTasks({
            ...tasks,
            [todolistId]: tasks[todolistId].map(task => task.id === taskId ? {...task, isDone: status} : task)
        })*/
        dispatchToTasks(changeTaskStatusAC(todolistId, taskId, status))
    }
    const changeTaskTitle = (todolistId: string, taskId: string, taskTitle: string) => {
        /*setTasks({
            ...tasks,
            [todolistId]: tasks[todolistId].map(task => task.id === taskId ? {...task, title: taskTitle} : task)
        })*/
        dispatchToTasks(changeTaskTitleAC(todolistId, taskId, taskTitle))
    }

    const removeTodolist = (todolistId: string) => {
        /*setTodolists(todolists.filter(tl => tl.id !== todolistId))
        delete tasks[todolistId]*/
        const action = removeTodolistAC(todolistId)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }
    const addTodolist = (totolistTitle: string) => {
        /*const newTodolistId = v1()
        setTodolists([{id: newTodolistId, title: totolistTitle, filter: 'All'}, ...todolists])
        setTasks({...tasks, [newTodolistId]: []})*/
        const action = addTodolistAC(totolistTitle)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }
    const changeTodolistTitle = (todolistId: string, newTitle: string) => {
        //setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, title: newTitle} : tl))
        dispatchToTodolists(changeTodolistTitleAC(todolistId, newTitle))
    }
    const changeFilter = (todolistId: string, value: FilterType) => {
        //setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, filter: value} : tl))
        dispatchToTodolists(changeFilterAC(todolistId, value))
    }

    //UI

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
                <Paper elevation={3} style={{padding: '20px'}}>
                    <Todolist key={tl.id}
                              title={tl.title}
                              filter={tl.filter}
                              todolistId={tl.id}
                              tasks={filteredTasks}

                              removeTask={removeTask}
                              addTask={addTask}
                              changeTaskStatus={changeTaskStatus}
                              changeTaskTitle={changeTaskTitle}

                              removeTodolist={removeTodolist}
                              changeFilter={changeFilter}
                              changeTodolistTitle={changeTodolistTitle}/>
                </Paper>
            </Grid>
        )
    })

    return (
        <div>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <AppBar position="static">
                    <Toolbar style={{justifyContent: 'space-between'}}>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            Todolists
                        </Typography>
                        <div>
                            <IconButton onClick={toggleColorMode}>
                                {mode === 'dark' ? <BrightnessHigh/> : <Brightness4/>}
                            </IconButton>
                            <Button color="inherit" variant={'outlined'}>Login</Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <Container fixed>
                    <Grid container style={{padding: '20px 0 20px 20px'}}>
                        <AddItemForm addItem={addTodolist}/>
                    </Grid>
                    <Grid container spacing={3}>
                        {todolistsToRender}
                    </Grid>
                </Container>
            </ThemeProvider>
        </div>
    );
}


export default AppWithReducers;
