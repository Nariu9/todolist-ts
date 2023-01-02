import React, {useEffect} from 'react';
import './App.css';
import {useActions, useAppSelector} from '../common/hooks/hooks';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {createTheme, ThemeProvider} from '@mui/material';
import {Brightness4, BrightnessHigh, Menu} from '@mui/icons-material';
import {Navigate, Route, Routes} from 'react-router-dom';
import {authActions} from '../features/Login';
import {selectColorTheme, selectIsInitialized, selectStatus} from '../features/Application/applicationSelectors';
import {selectIsLoggedIn} from '../features/Login/authSelectors';
import {appActions} from '../features/CommonActions/AppActions';
import {appAsyncActions} from '../features/Application';
import {ErrorSnackbars} from '../common/components/ErrorSnackbar/ErrorSnackbar';
import {TodolistsList} from '../features/TodolistsList/TodolistsList';
import {Login} from '../features/Login/Login';


type AppPropsType = {
    demo?: boolean
}

function App({demo = false}: AppPropsType) {

    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const isInitialized = useAppSelector(selectIsInitialized)
    const status = useAppSelector(selectStatus)
    const colorTheme = useAppSelector(selectColorTheme)

    const {logout} = useActions(authActions)
    const {changeAppTheme} = useActions(appActions)
    const {initializeApp} = useActions(appAsyncActions)

    useEffect(() => {
        if (!demo && !isInitialized) {
            initializeApp()
        }
    }, [initializeApp, demo, isInitialized])

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
    const toggleColorTheme = () => changeAppTheme({colorTheme})


    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '50%', textAlign: 'center', width: '100%'}}>
            <CircularProgress size={50}/>

        </div>
    }
    const logoutHandler = () => {
        logout()
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
                    {status === 'loading' &&
                        <LinearProgress sx={{top: '60px', left: '0', right: '0', position: 'absolute'}}/>}
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