import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import {IconButton, TextField} from '@mui/material';
import {AddBox} from '@mui/icons-material';


type AddItemFormPropsType = {
    addItem: (title: string) => void
}
export const AddItemForm = memo((props: AddItemFormPropsType) => {
    console.log('AddItemForm called')

    const [itemTitle, setItemTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const addTaskHandler = () => {
        if (itemTitle.trim() === '') {
            setError('Title is required')
            setItemTitle('')
            return
        }
        props.addItem(itemTitle.trim())
        setItemTitle('')
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setItemTitle(e.currentTarget.value)
        error && setError('')
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        e.key === 'Enter' && addTaskHandler()
    }

    return (
        <div>
            <TextField variant={'outlined'}
                       size={'small'}
                       label={'Title'}
                       value={itemTitle}
                       onChange={onChangeHandler}
                       onKeyDown={onKeyDownHandler}
                       error={!!error}
                       helperText={error}/>
            <IconButton onClick={addTaskHandler} color={'primary'}>
                <AddBox/>
            </IconButton>
        </div>
    )
})