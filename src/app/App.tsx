import React, {useEffect} from 'react';
import './App.css';
import {useActions, useAppDispatch, useAppSelector} from './hooks';
import {TodolistsList} from '../features/TodolistsList';
import {
    AppBar,
    Button,
    CircularProgress,
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
import {ErrorSnackbars} from '../components/ErrorSnackbar';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Login} from '../features/Login';
import {logout} from '../features/Login/auth-reducer';
import {selectColorTheme, selectIsInitialized, selectStatus} from './appSelectors';
import {selectIsLoggedIn} from '../features/Login/authSelectors';
import {changeAppTheme, initializeApp} from './app-reducer';

type AppPropsType = {
    demo?: boolean
}

function App({demo = false}: AppPropsType) {

    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const isInitialized = useAppSelector(selectIsInitialized)
    const status = useAppSelector(selectStatus)
    const colorTheme = useAppSelector(selectColorTheme)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!demo) {
            dispatch(initializeApp())
        }
    }, [dispatch, demo])

    //color theme logic
    const theme = createTheme({
        palette: {
            mode: colorTheme,
            primary: {
                main: '#27a1c6',
            },
            secondary: {
                main: '#ffde7d',
            },
        }
    })
    const toggleColorTheme = () => dispatch(changeAppTheme({colorTheme}))


    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '50%', textAlign: 'center', width: '100%'}}>
            <CircularProgress size={100}/>

        </div>
    }
    const logoutHandler = () => {
        dispatch(logout())
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
                                {colorTheme === 'dark' ? <BrightnessHigh/> : <Brightness4/>}
                            </IconButton>
                            {isLoggedIn &&
                                <Button color="inherit" variant={'outlined'} onClick={logoutHandler}>Log out</Button>}
                        </div>
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path={'/'} element={<TodolistsList demo={demo}/>}/>
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