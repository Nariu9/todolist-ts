import React, {ChangeEvent, FC, KeyboardEvent, memo, useState} from 'react';
import {IconButton, TextField} from '@mui/material';
import {AddBox} from '@mui/icons-material';


type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}
export const AddItemForm: FC<AddItemFormPropsType> = memo(({addItem, disabled}) => {
    console.log('AddItemForm called')

    const [itemTitle, setItemTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const addTaskHandler = () => {
        if (itemTitle.trim() === '') {
            setError('Title is required')
            setItemTitle('')
            return
        }
        addItem(itemTitle.trim())
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
                       helperText={error}
                       disabled={disabled}/>
            <IconButton onClick={addTaskHandler} color={'primary'} disabled={disabled}>
                <AddBox/>
            </IconButton>
        </div>
    )
})