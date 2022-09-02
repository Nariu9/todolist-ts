import React from 'react';
import './App.css';
import {changeAppThemeAC} from './app-reducer';
import {useAppDispatch, useAppSelector} from './hooks';
import {TodolistsList} from '../features/TodolistsList/TodolistsList';
import {
    AppBar,
    Button,
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


function App() {

    //color theme logic
    const dispatch = useAppDispatch()
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
                            <Button color="inherit" variant={'outlined'}>Login</Button>
                        </div>
                    </Toolbar>
                    {appState.status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <TodolistsList/>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default App;