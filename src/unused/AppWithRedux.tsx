/*
import React, {useState} from 'react';
import '../app/App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from '../components/AddItemForm/AddItemForm';
import {
    AppBar,
    Button,
    Container,
    createTheme,
    CssBaseline,
    Grid,
    IconButton,
    Paper,
    ThemeProvider,
    Toolbar,
    Typography
} from '@material-ui/core';
import {Brightness4, BrightnessHigh, Menu} from '@material-ui/icons';
import {
    addTodolistTC,
    changeFilterAC,
    changeTodolistTitleAC,
    FilterType,
    removeTodolistAC,
    TodolistDomainType,
} from '../features/TodolistsList/todolists-reducer';
import {addTasksTC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from '../features/TodolistsList/tasks-reducer';
import {useSelector} from 'react-redux';
import {AppRootStateType} from '../app/store';
import {TaskStatuses, TaskType} from '../api/todolists-api';
import {useAppDispatch} from '../app/hooks';

type TasksStateType = {
    [todolistID: string]: TaskType[]
}

function AppWithRedux() {

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

    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
    const dispatch = useAppDispatch()

    const removeTask = (todolistId: string, taskId: string) => {
        dispatch(removeTaskAC(todolistId, taskId))
    }
    const addTask = (todolistId: string, taskTitle: string) => {
        dispatch(addTasksTC(todolistId, taskTitle))
    }
    const changeTaskStatus = (todolistId: string, taskId: string, status: TaskStatuses) => {
        dispatch(changeTaskStatusAC(todolistId, taskId, status))
    }
    const changeTaskTitle = (todolistId: string, taskId: string, taskTitle: string) => {
        dispatch(changeTaskTitleAC(todolistId, taskId, taskTitle))
    }

    const removeTodolist = (todolistId: string) => {
        dispatch(removeTodolistAC(todolistId))
    }
    const addTodolist = (todolistTitle: string) => {
        dispatch(addTodolistTC(todolistTitle))
    }
    const changeTodolistTitle = (todolistId: string, newTitle: string) => {
        dispatch(changeTodolistTitleAC(todolistId, newTitle))
    }
    const changeFilter = (todolistId: string, value: FilterType) => {
        dispatch(changeFilterAC(todolistId, value))
    }

    //UI

    const todolistsToRender = todolists.map(tl => {

        let filteredTasks
        switch (tl.filter) {
            case 'active':
                filteredTasks = tasks[tl.id].filter(t => t.status === TaskStatuses.New)
                break;
            case 'completed':
                filteredTasks = tasks[tl.id].filter(t => t.status === TaskStatuses.Completed)
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


export default AppWithRedux;
*/

let c = 15
export default c
