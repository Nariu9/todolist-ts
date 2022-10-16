import React, {FC, useCallback, useEffect} from 'react';
import {useActions, useAppSelector} from '../../app/hooks';
import {Todolist, todolistsActions} from './Todolist';
import {AddItemForm} from '../../components/AddItemForm';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {Navigate} from 'react-router-dom';
import {selectIsLoggedIn} from '../Login/authSelectors';
import {selectTodolists} from './Todolist/todolistSelectors';

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
                <Box style={{width: '290px'}}>
                    <Todolist key={tl.id}
                              todolist={tl}
                              demo={demo}/>
                </Box>
            </Grid>
        )
    })

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: '20px 0 10px 20px'}}>
            <AddItemForm addItem={addTodolistHandler}/>
        </Grid>
        <Grid container spacing={3} style={{flexWrap: 'nowrap', overflowX: 'scroll'}}>
            {todolistsToRender}
        </Grid>
    </>
}