import React, {useCallback, useState} from 'react';
import './App.css';
import {TasksPropsType} from './Todolist';

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
import {addTodolistAC} from './state/todolists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {TodolistUpgraded} from './TodolistUpgraded';

export type FilterType = 'All' | 'Active' | 'Completed'

export type TodolistType = {
    id: string
    title: string
    filter: FilterType
}

export type TasksStateType = {
    [todolistID: string]: Array<TasksPropsType>
}

function AppWithReduxUpgraded() {

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

    const todolists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)
    const dispatch = useDispatch()

    const addTodolist = useCallback((todolistTitle: string) => {
        dispatch(addTodolistAC(todolistTitle))
    }, [dispatch])

    //UI

    const todolistsToRender = todolists.map(tl => {
        return (
            <Grid item key={tl.id}>
                <Paper elevation={3} style={{padding: '20px'}}>
                    <TodolistUpgraded key={tl.id}
                                      title={tl.title}
                                      filter={tl.filter}
                                      todolistId={tl.id}/>
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


export default AppWithReduxUpgraded;