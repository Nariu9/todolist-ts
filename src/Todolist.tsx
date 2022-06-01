import React from "react";
import {FilterType} from "./App";

type TodolistPropsType = {
    title?: string | number
    tasks: Array<TasksPropsType>
    removeTask:(id:number)=>void
    filterTasks:(value:FilterType)=>void
}

export type TasksPropsType = {
    id: number
    title: string
    isDone: boolean
}

export const Todolist = (props: TodolistPropsType) => {
    // @ts-ignore
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {props.tasks.map(el =>
                    <li key={el.id}><input type="checkbox" checked={el.isDone}/>
                        <button onClick={()=>props.removeTask(el.id)}>X</button> <span>{el.title}</span>
                    </li>)}
            </ul>
            <div>
                <button onClick={()=>props.filterTasks('All')}>All</button>
                <button onClick={()=>props.filterTasks('Active')}>Active</button>
                <button onClick={()=>props.filterTasks('Completed')}>Completed</button>
            </div>
        </div>
    );
}