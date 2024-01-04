import React, {useState, useEffect} from 'react'
import CreateUser from './CreateUser';
import CreateGroup from './CreateGroup';
import ChatBox from './ChatBox';
import './index.css'
import Call, {deleteAuth, getToken} from '../Utils';
import {Navigate} from 'react-router-dom'

function index() {

  const [dropdown, setDropdown] = useState(false);  
  const [userCreation, setUserCreation] = useState('');
  const [groupCreation, setGroupCreation] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [uname, setUname] = useState('');
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [displayChat, setDisplayChat] = useState('');
  const [displayGroups, setDisplayGroups] = useState('none');
  const [activeChat, setActiveChat] = useState('');

  
  useEffect(() => {
    const getGroups = async () => {
      try {        
        const response = await Call.get('get-data/');
        if (response.status === 200) {
          setUsers(response.data.users)
          setIsAdmin(response.data.is_admin)
          setUname(response.data.username)
          setGroups(response.data.groups)          
        }
      } catch (error) {
        console.log(error);
      }
    }
    let id = setInterval(() => {
      getGroups()
    }, 1000)
    
    return () => {
      clearInterval(id)
    }

    // getGroups()
  }, [])



  const toggleDropdown = () => {
    setDropdown(!dropdown);
  }

  const handleOnclickCreateUser = () => {
    setDropdown(false)
    const view = getComputedStyle(document.getElementById('pannel')).display === 'none' ? 'none' : 'block'
    setUserCreation(view)
    setGroupCreation('')
    setDisplayChat('')
    if(view === 'none'){
      setDisplayGroups('')
    } else {
      setDisplayGroups(view)
    }
  }


  const handleOnclickCreateGroup = () => {
    setDropdown(false)
    const view = getComputedStyle(document.getElementById('pannel')).display === 'none' ? 'none' : 'block'
    setGroupCreation(view)
    setDisplayChat('')
    setUserCreation('')
    if(view === 'none'){
      setDisplayGroups('')
    } else {
      setDisplayGroups(view)
    }
  }

  const handleOnclickLogout = async () => {    
    try {
      const response = await Call.get('logout/');
      if (response.status === 200) {
        deleteAuth()
        setDropdown(false)
      }
    } catch (error) {
      console.log(error);
    }
  }  

  const onClickGroup = (e) => {
    let view = getComputedStyle(document.getElementById('pannel')).display
    setDisplayChat(view)
    setActiveChat(e.target.id)
    setUserCreation('')
    setGroupCreation('')
    if(view === 'none'){
      setDisplayGroups('')
    }
    setDropdown(false)
  }
  
  console.log(groups)
  if (!getToken()) {
    return <Navigate to="/" replace />
  }
  return (
    <div className="container-fluid vh-100 bg-transparent dashboard-container">
      <div className="row vh-100 gap-3 bg-dark">
        {/* profile */}
        <div className="col col-md-4 col-lg-3 m-1 p-0 d-flex flex-column">

          <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
              <div className='py-1'>
                <span className="navbar-brand fs-5 bg-primary px-3 rounded-circle">{uname?.charAt(0)?.toUpperCase()}</span>
                <span>{uname}</span>
              </div>
              
              <button
                className="navbar-toggler outline-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
                onClick={toggleDropdown}
              >
                <i className="fa-solid fa-bars"></i>
              </button>
              
              <div className={`collapse navbar-collapse ${dropdown ? 'show' : ''}`} id="navbarNavDropdown">
                <ul className="navbar-nav ms-auto bg-secondary rounded mt-2">
                  {isAdmin && <li className="nav-item p-1" onClick={handleOnclickCreateUser} > <button className="nav-link text-light" >User Management</button></li>}
                  <li className="nav-item p-1" onClick={handleOnclickCreateGroup} > <button className="nav-link text-light" >Create Group</button></li>
                  <li className="nav-item p-1" onClick={handleOnclickLogout} > <button className="nav-link text-light" >Logout</button></li>
                </ul>
              </div>              
            </div>            
          </nav>

          { userCreation === 'none' && <CreateUser users={users} setUsers={setUsers} />}
          { groupCreation === 'none' && <CreateGroup users={users} setGroupCreation={setGroupCreation} setGroups={setGroups} groupCreation={groupCreation} /> }
          { groups.length > 0 && displayGroups &&
            <div className="p-2 border bg-light d-flex flex-column h-100 groups-container">
              <span className='fs-5 bg-info p-3 fw-bold text-center mb-5 bg-opacity-75'>Groups</span>
              {groups.map((group) => (
                <button id={group.name} className='btn mb-2 bg-success bg-opacity-50 rounded-1 text-start ' onClick={onClickGroup}  key={group.name}>{group.name}</button>
              ))}              
            </div> 
          }
          { displayChat === 'none' && <ChatBox chat={groups.filter((group) => group.name === activeChat)[0]} uname={uname} setGroups={setGroups} groups={groups} /> }
        </div>

        {/* pannel */}
        <div id='pannel' className="col m-1 border d-none d-md-block">
          { userCreation === 'block' && <CreateUser users={users} setUsers={setUsers} />}
          { groupCreation === 'block' && <CreateGroup users={users} setGroupCreation={setGroupCreation} setGroups={setGroups} groupCreation={groupCreation} /> }
          { displayChat === 'block' && <ChatBox chat={groups.filter((group) => group.name === activeChat)[0]} uname={uname} setGroups={setGroups} groups={groups} /> }
        </div>
      </div>
    </div>
  )
}

export default index