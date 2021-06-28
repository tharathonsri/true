const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = new express()

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(cors())
/*
let todoList =[{
    name:'a',
    status: 'active'
}]*/
var todoList = [];
todoList.push({id: 1, name: "Go to school", status: "active"});
todoList.push({id: 2, name: "Go shopping", status: "active"});
todoList.push({id: 3, name: "Sleep", status: "active"});
todoList.push({id: 4, name: "Do homework", status: "active"});
todoList.push({id: 5, name: "Exercise", status: "active"});
todoList.push({id: 6, name: "Coding", status: "active"});


app.get('/',(req,res) =>{
    res.send(todoList)
})

app.post('/',(req,res) =>{
    todoList.map((todo,index) => todo.id = index+1)
    req.body.id = todoList.length+1
    console.log(req.body)
    todoList.push(req.body)
    res.send(todoList)
})

app.put('/',(req,res) =>{
    let dataSet = todoList.map(todo => {
        todo.status = "complete"
        return todo
      })
    todoList = dataSet
    res.send(todoList)
})

app.put('/:id',(req,res) =>{
    let todoIndex = req.params.id
    let dataSet = todoList.filter(todo => todo.id != todoIndex)
    let dataUpdate = todoList.filter(todo => todo.id == todoIndex)

    dataUpdate[0].status = req.body.status
    dataUpdate[0].status === "complete" ? dataSet.push(dataUpdate[0]) : dataSet.unshift(dataUpdate[0]);
    todoList = dataSet
    res.send(todoList)
})

app.delete('/',(req,res) =>{
    let dataSet = todoList.filter(todo => todo.status !== "complete")
    todoList = dataSet
    res.send(todoList)
})

app.delete('/:id',(req,res) =>{
    let todoIndex = req.params.id
    let dataSet = todoList.filter(todo => todo.id != todoIndex)
    dataSet.map((todo,index) => todo.id = index+1)
    todoList = dataSet
    res.send(todoList)
})

app.listen(3001,()=>{
    console.log('start')
})