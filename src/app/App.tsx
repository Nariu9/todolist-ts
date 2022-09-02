import React from 'react';
import './App.css';
import {useSelector} from 'react-redux';
import {AppRootStateType} from './store';
import {changeThemeAC, ColorThemeType} from './colorThemes-reducer';
import {useAppDispatch} from './hooks';
import {TodolistsList} from '../features/TodolistsList/TodolistsList';
import {
    AppBar,
    Button,
    Container,
    createTheme,
    CssBaseline,
    IconButton,
    ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material';
import {Brightness4, BrightnessHigh, Menu} from '@mui/icons-material';


function App() {

    //color theme logic
    const dispatch = useAppDispatch()
    const colorTheme = useSelector<AppRootStateType, ColorThemeType>(state => state.colorThemes.colorTheme)
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
    const toggleColorTheme = () => dispatch(changeThemeAC(colorTheme))

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
                            <IconButton onClick={toggleColorTheme}>
                                {colorTheme === 'dark' ? <BrightnessHigh/> : <Brightness4/>}
                            </IconButton>
                            <Button color="inherit" variant={'outlined'}>Login</Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <Container fixed>
                    <TodolistsList/>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default App;