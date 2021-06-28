import React from 'react'
import './App.css';
import TodoList from './component/TodoList';


function App() {
  return (
    <div style={{width:"480px",margin:"0 auto",textAlign:"center"}}>
      <h1>Todo List</h1>
      <TodoList/>
    </div>
  );
}

export default App;
