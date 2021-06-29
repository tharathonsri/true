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

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';

import { TextField, Paper, Grid } from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
  }));

function TodoList(props){
  
    const [dataList, setDataList] = useState([])
    const [inputValue, setInputValue] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterColor, setFilterColor] = useState([]);

    const colorList = [
     { name:"red",code:'#ff0000'},
     { name:"blue",code:'#0000ff'},
     { name:"green",code:'#00ff00'},

    ]

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
        status: "active",
        color: null
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

    const changeColor = (todoIndex,todoColor) => {
      axios.put('http://localhost:3001/'+todoIndex,{
        color: todoColor
      })
      .then(result =>{
        setDataList(result.data)
      })
      .catch(err =>{
        console.log(err)
      })
    }

    const handleFilterColor = (color) => {
      const colorIndex = filterColor.indexOf(color);
      const newFilterColor = [...filterColor];
      colorIndex === -1 ? newFilterColor.push(color): newFilterColor.splice(colorIndex, 1)
      setFilterColor(newFilterColor)
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
            {dataList.filter(data => filterStatus === 'all' ? true : data.status === filterStatus).filter(data => filterColor.length === 0 ? true : filterColor.indexOf(data.color) !== -1).map(data =>{
                const labelId = `checkbox-list-label-${data.id}`
                return (
                    <ListItem key={labelId} dense>
                      <ListItemIcon onClick={e => markComplete(data.id)}>
                        <Checkbox
                          edge="start"
                          checked={data.status === "complete" ? true : false}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={data.name} />
                      <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="demo-simple-select-outlined-label">color</InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={data.color ? data.color : "transparent"}                          
                          label="color"
                          onChange={e =>{changeColor(data.id,e.target.value)}}
                        >
                          <MenuItem value="transparent" ><Box bgcolor="transparent" p={2} /></MenuItem>
                          {colorList.map(color => <MenuItem key={color.name} value={color.name} ><Box bgcolor={color.code} p={2} /></MenuItem>)}
                        </Select>
                      </FormControl>
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
                <ListItemText primary="All" onClick={e=> setFilterStatus('all')}/>
               </ListItem>
               <ListItem button dense>
                 <ListItemText primary="Active" onClick={e=> setFilterStatus('active')}/>
               </ListItem>
               <ListItem button dense>
                 <ListItemText primary="Complete" onClick={e=> setFilterStatus('complete')}/>
               </ListItem>
            </List>
          </Grid>
          <Grid item>
          <List className={classes.root}>
              Filter by Color
              {colorList.map((color) => {
                return (
                  <ListItem key={color.name}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"                        
                        tabIndex={-1}
                        disableRipple
                        onClick={e => handleFilterColor(color.name)}
                      />
                    </ListItemIcon>
                     <Box bgcolor={color.code} p={2} />
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        </Grid>
        </Paper>
    </div>
    )
}

export default TodoList