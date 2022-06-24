import React, {ChangeEvent} from 'react';

type CheckboxPropsType = {
    checked:boolean
    callback:(e:ChangeEvent<HTMLInputElement>)=>void
}

export const Checkbox = (props:CheckboxPropsType) => {

    const onChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
      props.callback(e)
    }

    return (
        <input
            onChange={onChangeHandler}
            type="checkbox" checked={props.checked}/>
    );
};