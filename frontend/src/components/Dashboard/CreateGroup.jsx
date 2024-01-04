import React, { useState, useEffect, useRef } from 'react';
import Call from '../Utils';
import './index.css'

function CreateGroup({users, setGroups, setGroupCreation, groupCreation}) {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);  
  const [statusMsg, setStatusMsg] = useState('');

  const handleUserSelection = (user) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
      setDropdownOpen(false); 
    }
  };

  const handleGroupCreation = async (e) => {
    e.preventDefault();
    try {
      const response = await Call.post(`create-group/`, {name: groupName, users: selectedUsers});
      console.log(response);
      if (response.status === 200) {
        console.log(response.data)
        setGroups(response.data.groups)
        setStatusMsg('Group created successfully');
        console.log(groupCreation)
        if(groupCreation === 'none'){
          setTimeout(() => {
            setGroupCreation('');                    
          }, 500);
        }
      }
    } catch (error) {
      console.log(error);
      setStatusMsg(error.response.data.detail);
    }
  }  


  return (
    <div>
      <form onSubmit={handleGroupCreation}>
        <input
          className='form-control my-3'
          type="text"
          placeholder="Group Name"
          required
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle form-control border"
            type="button"
            id="userDropdown"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Select Users
          </button>
          <ul className={`dropdown-menu${dropdownOpen ? ' show' : ''}`} aria-labelledby="userDropdown" >
            {users.map((user, index) => (
              <li key={index}>
                <a href="#" className="dropdown-item" onClick={() => handleUserSelection(user)} > {user} </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="selected-users-box">
          Selected Users:
          {selectedUsers.map((user) => (
            <span key={user} className="badge badge-primary">
              {user}
            </span>
          ))}
        </div>
        <button type="submit" className="btn btn-primary">
          Create Group
        </button>
        {statusMsg && <p className="text-info">{statusMsg}</p>}
      </form>
    </div>
  );

}

export default CreateGroup;







