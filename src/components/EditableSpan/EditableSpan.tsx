import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import {TextField} from '@mui/material';

type EditableSpanPropsType = {
    value: string
    onChange: (value: string) => void
}
export const EditableSpan = memo((props: EditableSpanPropsType) => {
    console.log('EditableSpan called')
    const [editMode, setEditMode] = useState(false)
    const [text, setText] = useState(props.value)

    const onEditMode = () => {
        setEditMode(true)
    }

    const offEditMode = () => {
        setEditMode(false)
        text.trim() !== '' && props.onChange(text)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.currentTarget.value)
    }


    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        e.key === 'Enter' && offEditMode()
    }

    return editMode
        ?
        <TextField value={text}
                   onChange={onChangeHandler}
                   onBlur={offEditMode}
                   onKeyDown={onKeyDownHandler}
                   autoFocus/>
        : <span onDoubleClick={onEditMode}>{props.value}</span>
})