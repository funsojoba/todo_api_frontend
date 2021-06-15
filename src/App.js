import React, { Component } from 'react'
import './App.css'


class App extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       todos: [],
       activeItem:{
         id:null,
         title:'',
         description:'',
         completed:false
       },
       editing:false,
    }
  }

  getCookie= (name)=> {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  componentDidMount() {
    this.fetchTask()
  }

  fetchTask = ()=>{
    fetch('http://127.0.0.1:8000/api/v1/')
    .then(response => response.json())
    .then(data =>(
      this.setState({
        todos: data
      })
    ))
  }

  handleChange = (e)=>{
    let value = e.target.value

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value,
      }
    })
  }

  handleSecondChange = (e)=>{
    let value = e.target.value

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        description:value,
      }
    })
  }

  handleCheck = (task)=>{
    task.completed = !task.completed

    let baseUrl = `http://127.0.0.1:8000/api/v1/${task.id}/`
    const csrftoken = this.getCookie('csrftoken');

    let taskBody = {
      title:task.title,
      description:task.description,
      completed:task.completed
    }
    fetch(baseUrl, {
      method:'PUT',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken
      },
      body:JSON.stringify(taskBody)
    }).then(response =>{
      this.fetchTask()
    })

    this.setState({
      ...this.state.activeItem,
      completed:task.completed
    })

    
  }

  handleSubmit = (e)=>{
    e.preventDefault()
    let baseUrl = 'http://127.0.0.1:8000/api/v1/'
    const csrftoken = this.getCookie('csrftoken');

    fetch(baseUrl, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken
      },
      body:JSON.stringify(this.state.activeItem)
    }).then(response =>{
      this.fetchTask()
      this.setState({
        activeItem:{
         id:null,
         title:'',
         description:'',
         completed:false
       },
      })
    }).catch(e => console.log('ERROR:', e))
  }
  
  handleDelete = (item)=>{
    let baseUrl = `http://127.0.0.1:8000/api/v1/${item.id}/`
    fetch(baseUrl, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(item)
    }).then(response=>{
      this.fetchTask()
    })
    
  }

  startEdit = (task)=>{
    this.setState({
      activeItem:task,
      editing:true
    })
  }

  render() {
    let tasks = this.state.todos
    let self = this
    return (
      <div className="container">
        <div className="task-container">
          <div className="form-group">
              <form id="form" onSubmit={this.handleSubmit}>
                  <label for="todo-name">Task title</label><br></br>
                  <input 
                      type="text" 
                      onChange={this.handleChange} 
                      name="title" 
                      placeholder="todos" 
                      value={this.state.activeItem.title}
                      id="todo-name" /><br></br>

                  <label for="todo-description">Task description</label><br></br>
                  <textarea 
                      onChange={this.handleSecondChange} 
                      placeholder="short description" 
                      id="todo-description"
                      value={this.state.activeItem.description}
                      name="description"></textarea>
                      <br></br>
                  <button><i className="fas fa-plus-circle fa-lg"></i> ADD TASK</button>
              </form>
          </div>

          <div className="list-wrapper">
            {tasks.map(task =>{
                return (
                    <div>
                      {task.completed === false ? (
                          <div className="task-wrapper" key={task.id}>
                        <div className="task-name"> 
                            <h2>{task.title}</h2>
                            <small>{task.description}</small>
                        </div>
                        <div className="buttons">
                          <div 
                              className="task-button" 
                              id="edit" onClick={()=>self.startEdit(task)}>
                                <i className="fas fa-pen-square fa-lg"></i>
                          </div>
                          <div 
                              className="task-button" 
                              id="check"
                              onClick={()=>self.handleCheck(task)}
                              >
                                <i className="fas fa-check-circle fa-lg"></i>
                          </div>
                          <div 
                              className="task-button" 
                              onClick = {()=>this.handleDelete(task)}
                              id="delete">
                                <i className="fas fa-trash fa-lg"></i>
                          </div>
                        </div>
              </div>
                      ) : (
                          <div className="task-wrapper" key={task.id} id="checked">
                        <div className="task-name"> 
                            <h2>{task.title}</h2>
                            <small>{task.description}</small>
                        </div>
                        <div className="buttons">
                          <div 
                              className="task-button" 
                              id="edit" onClick={()=>self.startEdit(task)}>
                                <i className="fas fa-pen-square fa-lg"></i>
                          </div>
                          <div 
                              className="task-button" 
                              id="check"
                              onClick={()=>this.handleCheck(task)}
                              >
                                <i className="fas fa-check-circle fa-lg"></i>
                          </div>
                          <div 
                              className="task-button" 
                              onClick = {()=>this.handleDelete(task)}
                              id="delete">
                                <i className="fas fa-trash fa-lg"></i>
                          </div>
                        </div>
              </div>
                      )}
                    </div>
                )
              }
            )}
          </div>
        
        </div>
      </div>
    )
  }
}

export default App