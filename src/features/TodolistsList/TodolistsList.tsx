import React, {FC, useCallback, useEffect} from 'react';
import {addTodolistTC, fetchTodolistsTC} from './todolists-reducer';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {Todolist} from './Todolist/Todolist';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm';
import {Grid, Paper} from '@mui/material';

type TodolistsListPropsType = {
    demo?: boolean
}

export const TodolistsList: FC<TodolistsListPropsType> = ({demo = false}) => {

    const todolists = useAppSelector(state => state.todolists)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(fetchTodolistsTC())
    }, [dispatch, demo])

    const addTodolist = useCallback((todolistTitle: string) => {
        dispatch(addTodolistTC(todolistTitle))
    }, [dispatch])

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

    return <>
        <Grid container style={{padding: '20px 0 20px 20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {todolistsToRender}
        </Grid>
    </>
}