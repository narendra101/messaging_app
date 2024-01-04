import React, {useState, useEffect} from 'react'
import Call, {getToken} from '../Utils'

function CreateUser({users, setUsers}) {
  const [data, setData] = useState({
    email: '',
    username: '',
    password: '',
    emailErr: '',
    usernameErr: '',
    
  })
  const [statusMSG, setStatusMSG] = useState('')

  useEffect(() => {
    if(statusMSG) {
      setTimeout(() => {
        setStatusMSG('')
      }, 3000)
    }
  }, [statusMSG])

  const onChangeField = (e) => {
    setData(ps => ({
      ...ps,
      [e.target.id]: e.target.value
    }))
  }


  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Call.post(`signup/`, {email: data.email, username: data.username, password: data.password});
      if(response.status === 200) {
        console.log(response)
        setData({email: '', username: '', password: '', emailErr: '', usernameErr: ''})        
        setStatusMSG('User created successfully')
      } else {
        // console.log(response)
      }
    } catch (error) {       
      if (error?.response?.data?.email || error?.response?.data?.username) {
        setData(ps => ({
          ...ps,
          emailErr: error?.response?.data?.email ? error.response.data.email[0] : '',
          usernameErr: error?.response?.data?.username ? error.response.data.username[0] : '',
        }))
      }
    }
  }

  const deleteUser = async (e) => {
    try {
      const response = await Call.delete(`delete-user/${e.target.id}/`)
      if(response.status === 200) {
        console.log(response)
        setUsers(users.filter(u => u !== e.target.id))
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="container mt-5">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label text-light">Email address</label>
          <input required type="email" value={data.email} className="form-control" id="email" aria-describedby="emailHelp" onChange={onChangeField} placeholder='Enter Email Address: ' />
          <div id="emailHelp" className="form-text text-danger">{data.emailErr}</div>
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label text-light">Username</label>
          <input required type="text" value={data.username} className="form-control" id="username" onChange={onChangeField} placeholder='Enter Username: ' />
          <div id="emailHelp" className="form-text text-danger">{data.usernameErr}</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label text-light">Password</label>
          <input required type="password" value={data.password} className="form-control" id="password" onChange={onChangeField} placeholder='Enter Password: ' />
          <p className='text-success'>{statusMSG}</p>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {/* deleting users */}
      <div className='mt-2'>
        <h3 className='text-light'>Delete Users</h3>
        { users.map((user) => (
          <p key={user} id={user} className='btn btn-outline-danger d-block' onClick={deleteUser}>{user}</p>
        ))}
      </div>
    </div>
  )
}

export default CreateUser