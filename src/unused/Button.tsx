import React from 'react';

type ButtonPropsType = {
    className?:string
    name: string
    callback: () => void
}

export const Button = (props: ButtonPropsType) => {

    const onClickHandler = () => {
        props.callback()
    }

    return (
        <button className={props.className} onClick={onClickHandler}>{props.name}</button>
    );
};

