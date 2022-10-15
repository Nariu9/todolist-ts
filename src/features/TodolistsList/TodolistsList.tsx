import React, {FC, useCallback, useEffect} from 'react';
import {useActions, useAppSelector} from '../../app/hooks';
import {Todolist} from './Todolist';
import {AddItemForm} from '../../components/AddItemForm';
import {Grid, Paper} from '@mui/material';
import {Navigate} from 'react-router-dom';
import {selectIsLoggedIn} from '../Login/authSelectors';
import {selectTodolists} from './Todolist/todolistSelectors';
import {todolistsActions} from './Todolist';

type TodolistsListPropsType = {
    demo?: boolean
}

export const TodolistsList: FC<TodolistsListPropsType> = ({demo = false}) => {

    const todolists = useAppSelector(selectTodolists)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const {fetchTodolists, addTodolist} = useActions(todolistsActions)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        fetchTodolists()
    }, [fetchTodolists, demo, isLoggedIn])

    const addTodolistHandler = useCallback((todolistTitle: string) => {
        addTodolist(todolistTitle)
    }, [addTodolist])

    const todolistsToRender = todolists.map(tl => {
        return (
            <Grid item key={tl.id}>
                <Paper elevation={3} style={{padding: '20px'}}>
                    <Todolist key={tl.id}
                              todolist={tl}
                              demo={demo}/>
                </Paper>
            </Grid>
        )
    })

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: '20px 0 20px 20px'}}>
            <AddItemForm addItem={addTodolistHandler}/>
        </Grid>
        <Grid container spacing={3}>
            {todolistsToRender}
        </Grid>
    </>
}