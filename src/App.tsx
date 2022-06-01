import React, {useState} from 'react';
import './App.css';
import {TasksPropsType, Todolist} from "./Todolist";

export type FilterType = 'All' | 'Active' | 'Completed'

function App() {

    let [tasks1, setTasks1] = useState<Array<TasksPropsType>>([
        {id: 1, title: "HTML&CSS", isDone: true},
        {id: 2, title: "JS", isDone: true},
        {id: 3, title: "ReactJS", isDone: false},
        {id: 4, title: "Redux", isDone: false}
    ])
    /*const tasks2 = [
        {id: 1, title: "Hello world", isDone: true},
        {id: 2, title: "I am Happy", isDone: false},
        {id: 3, title: "Yo", isDone: false}
    ]*/


    const removeTask = (id:number) => {
        tasks1 = tasks1.filter(el=> el.id !== id)
        setTasks1(tasks1)
    }

    const [filter, setFilter] = useState<FilterType>('All')

    if (filter === 'Active') {
        tasks1 = tasks1.filter(el => !el.isDone)
    } else if (filter === 'Completed') {
        tasks1 = tasks1.filter(el => el.isDone)
    }


    const filterTasks = (value:FilterType) => {
        setFilter(value)
    }

    return (
        <div className="App">
            <Todolist title={"What to learn"}
                      tasks={tasks1}
                      removeTask={removeTask}
                      filterTasks={filterTasks}/>
            {/*<Todolist title={123} tasks={tasks2}/>*/}
        </div>
    );
}


export default App;
