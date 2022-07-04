import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type EditableSpanPropsType = {
    value: string
    onChange: (value: string) => void
}
export const EditableSpan = (props: EditableSpanPropsType) => {
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
        <input value={text} onChange={onChangeHandler} onBlur={offEditMode} onKeyDown={onKeyDownHandler} autoFocus/>
        : <span onDoubleClick={onEditMode}>{props.value}</span>
}