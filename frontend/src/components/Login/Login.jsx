import React, {useState, useEffect} from 'react'
import { Navigate } from 'react-router-dom'
import './Login.css'
import {setAuth, getToken} from '../Utils'
import Call from '../Utils'

function index() {
  let [data, setData] = useState({
    username: '',
    password: '',    
  });  
  let [loggedIn, setLoggedIn] = useState(false); 

  const onChangeField = (e) => {
    setData(ps => ({
      ...ps,
      [e.target.id]: e.target.value
    }))    
  }


  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Call.post('login/', data);      
      console.log(response)
      if(response.status === 200) {
        console.log(response)        
        setLoggedIn(true)
        setAuth(response.data.token)
      }
    } catch (error) {
      console.log(error);
    }
  }

  if(loggedIn || getToken() !== null) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className='container vh-100 w-100 d-flex justify-content-center align-items-center login-container'>
      <div className="row w-100 gap-3 d-flex justify-content-center">
        <div className="col-md-6 text-light">
          <h1 className="text-center">Login</h1>
          <form action="" className="form p-5 rounded d-flex flex-column gap-3" id="login-form" onSubmit={onSubmit}>
            <div>
              <label htmlFor="username">Username</label>
              <input className="form-control bg-transparent text-light" required type="text" id="username" placeholder="Enter Username: " onChange={onChangeField} value={data.username} />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input className="form-control bg-transparent text-light" required type="password" id="password" placeholder="Enter Password: " onChange={onChangeField} value={data.password} />
            </div>
            <button className='btn btn-outline-primary w-100' type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default index