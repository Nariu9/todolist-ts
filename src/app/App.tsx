import React, {useEffect} from 'react';
import './App.css';
import {changeAppThemeAC, initializeAppTC} from './app-reducer';
import {useAppDispatch, useAppSelector} from './hooks';
import {TodolistsList} from '../features/TodolistsList/TodolistsList';
import {
    AppBar,
    Button, CircularProgress,
    Container,
    createTheme,
    CssBaseline,
    IconButton,
    LinearProgress,
    ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material';
import {Brightness4, BrightnessHigh, Menu} from '@mui/icons-material';
import {ErrorSnackbars} from '../components/ErrorSnackbar/ErrorSnackbar';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Login} from '../features/Login/Login';
import {logoutTC} from '../features/Login/auth-reducer';

type AppPropsType = {
    demo?: boolean
}

function App({demo = false}: AppPropsType) {

    const dispatch = useAppDispatch()
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    useEffect(() => {
        dispatch(initializeAppTC())
    }, [dispatch])

    //color theme logic
    const appState = useAppSelector(state => state.app)
    const theme = createTheme({
        palette: {
            mode: appState.colorTheme,
            primary: {
                main: '#27a1c6',
            },
            secondary: {
                main: '#ffde7d',
            },
        }
    })
    const toggleColorTheme = () => dispatch(changeAppThemeAC(appState.colorTheme))


    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '50%', textAlign: 'center', width: '100%'}}>
            <CircularProgress size={100}/>

        </div>
    }
    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    return (
        <div>
            <ErrorSnackbars/>
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
                            <IconButton onClick={toggleColorTheme}>
                                {appState.colorTheme === 'dark' ? <BrightnessHigh/> : <Brightness4/>}
                            </IconButton>
                            {isLoggedIn &&
                                <Button color="inherit" variant={'outlined'} onClick={logoutHandler}>Log out</Button>}
                        </div>
                    </Toolbar>
                    {appState.status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path={'/todolist-ts'} element={<TodolistsList demo={demo}/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                        <Route path={'/404'} element={<h1 style={{textAlign: 'center'}}>404: PAGE NOT FOUND</h1>}/>
                        <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                    </Routes>

                </Container>
            </ThemeProvider>
        </div>
    );
}

export default App;