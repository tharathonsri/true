import React,{ useState,useEffect } from 'react'
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { TextField, Paper, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
  }));

function TodoList(props){
  var todoItems = [];
  todoItems.push({id: 1, name: "learn react", status: "active"});
  todoItems.push({id: 2, name: "Go shopping", status: "active"});
  todoItems.push({id: 3, name: "buy flowers", status: "active"});
  
    const [dataList, setDataList] = useState([])
    const [inputValue, setInputValue] = useState('');
    const [filterValue, setFilterValue] = useState('all');


    const classes = useStyles();

    const onInputChange = (e) =>{
      setInputValue(e.target.value)
    }

    const onKeyPress = (e) =>{
      //console.log(e.key)
      if (e.key === 'Enter') {
        addTodo(e.target.value)
        setInputValue('')
      }
    }

    const addTodo = (todo) => {
      axios.post('http://localhost:3001/',{
        name: todo, 
        status: "active"
      })
        .then(result =>{
          setDataList(result.data)
        })
        .catch(err =>{
          console.log(err)
        })
    }

    const removeTodo = (todoIndex) => {
      axios.delete('http://localhost:3001/'+todoIndex)
        .then(result =>{
          setDataList(result.data)
        })
        .catch(err =>{
          console.log(err)
        })
    }

    const markComplete = (todoIndex) =>{
      let dataSelected = dataList.filter(todo => todo.id === todoIndex)

      axios.put('http://localhost:3001/'+todoIndex,{
        status: dataSelected[0].status === "active" ? "complete" : "active"
      })
        .then(result =>{
          setDataList(result.data)
        })
        .catch(err =>{
          console.log(err)
        })
    }

    const markAllComplete = () =>{
      axios.put('http://localhost:3001/')
        .then(result =>{
          setDataList(result.data)
        })
        .catch(err =>{
          console.log(err)
        })
    }

    const clearAllComplete = () =>{
      axios.delete('http://localhost:3001/')
        .then(result =>{
          setDataList(result.data)
        })
        .catch(err =>{
          console.log(err)
        })
    }

    useEffect(() => {
        axios.get('http://localhost:3001/')
        .then(result =>{
          //console.log(result.data)
          setDataList(result.data)
        })
        .catch(err =>{
          console.log(err)
        })
      },[])

    return (
        <div>
          <Paper style={{padding:"10px"}}>
          <Grid container>
            <Grid item style={{width:"100%"}}>
              <TextField
                placeholder="What needs to be done?"
                value={inputValue}
                onChange={onInputChange}
                onKeyPress={onKeyPress}
                fullWidth
              />
            </Grid>
          </Grid>
             <List className={classes.root}>
            {dataList.filter(data => filterValue === 'all' ? true : data.status === filterValue).map(data =>{
                const labelId = `checkbox-list-label-${data.id}`
                return (
                    <ListItem key={labelId} dense>
                      <ListItemIcon onClick={e => markComplete(data.id)}>
                        <Checkbox
                          edge="start"
                          checked={data.status == "complete" ? true : false}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={data.name} />
                      <ListItemSecondaryAction onClick={e => removeTodo(data.id)}>
                        <IconButton edge="end" aria-label="delete">
                          <CloseIcon/>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
            })}
        </List>

        <Grid container spacing={2}>  
          <Grid item >
            <List className={classes.root}>
                  Actions
                <ListItem button dense>
                  <ListItemText primary="Mark All Completed" onClick={markAllComplete} />
                </ListItem>
                <ListItem button dense>
                  <ListItemText primary="Clear Completed" onClick={clearAllComplete}/>
                </ListItem>
            </List>
          </Grid>
          <Grid item>
            <List className={classes.root}>
                  Remaining Todos
                <ListItem dense>
                  <ListItemText primary={dataList.filter(data => data.status === "active").length > 1 ? `${dataList.filter(data => data.status === "active").length} items left` : `${dataList.filter(data => data.status === "active").length} item   left`} />
                </ListItem>
            </List>
          </Grid>
          <Grid item>
            <List className={classes.root}>
                 Filter by Status
               <ListItem button dense>
                <ListItemText primary="All" onClick={e=> setFilterValue('all')}/>
               </ListItem>
               <ListItem button dense>
                 <ListItemText primary="Active" onClick={e=> setFilterValue('active')}/>
               </ListItem>
               <ListItem button dense>
                 <ListItemText primary="Complete" onClick={e=> setFilterValue('complete')}/>
               </ListItem>
            </List>
          </Grid>
        </Grid>
        </Paper>
    </div>
    )
}

export default TodoList