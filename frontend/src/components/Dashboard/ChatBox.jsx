import React, {useState} from 'react'
import './index.css'
import Call from '../Utils'

function ChatBox({chat, uname, setGroups, groups}) {
  if(chat === undefined){
    return (<></>)
  }
  const {messages, group_members, name, liked_by, creator} = chat  

  const [newMessage, setNewMessage] = useState('');
 

  const handleLikeClick = async (msgId, message, like_count, liked_by, user) => {
    const updated_liked_by = liked_by.includes(uname) ? liked_by : [...liked_by, uname]
    try {
      const response = await Call.post(`set-like/`, {user: uname, msgId: msgId})
      if (response.status === 200) {
        setNewMessage('')
        groups = groups.filter(group => group.name !== chat.name)
        let newMessages = []
        for (let message of messages) {
          if (message.id === msgId) {
            message.liked_by = updated_liked_by
            message.like_count = like_count + 1
          }
          newMessages.push(message)
        }
        setGroups([
            ...groups,
            {
                name: chat.name,
                group_members: chat.group_members,
                messages: newMessages
            }
        ])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await Call.delete(`delete-group/${chat.name}`)
      if (response.status === 200) {
        setGroups(groups.filter(group => group.name !== chat.name))
      }
    } catch (error) {
      console.log(error)
    }
      
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    try {
      const response = await Call.post(`send-message/`, {message: newMessage, user: uname, group: chat.name})
      if (response.status === 200) {
        setNewMessage('')
        groups = groups.filter(group => group.name !== chat.name)
        setGroups([
            ...groups,
            {
                name: chat.name,
                group_members: chat.group_members,
                messages: [...messages, { text: newMessage, user: uname, liked_by: [], like_count: 0} ]
            }
        ])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeMessage = (e) => {
    setNewMessage(e.target.value)
  }

  return (
    <div className="d-flex flex-column" style={{boxSizing: 'border-box'}}>
    <div className="text-light p-1 fs-3 m-0 bg-opacity-10 bg-secondary mt-1 d-flex justify-content-between align-items-center">
        <span className=''>{name}</span>  
        { creator === uname && <span className='btn btn-outline-danger' onClick={handleDelete}>delete group</span> }
    </div>
    <div className="chat-area">
      {messages.map((message) => (
        <Message key={message.id} msgId={message.id} text={message.text} user={message.user} like_count={message.like_count} isCurrentUser={message.user === uname} liked_by={message.liked_by} handleLikeClick={handleLikeClick} uname={uname} />
      ))}
    </div>
    <form className="d-flex py-3 gap-2" onSubmit={handleSendMessage}>
      <input required type="text" className="form-control mr-2" placeholder="Type your message..." value={newMessage} onChange={handleChangeMessage} />
      <button className="btn btn-primary " >Send</button>
    </form>
    </div>
  );
}

export default ChatBox


const Message = ({ msgId,  text, user, like_count, isCurrentUser, handleLikeClick, liked_by, uname }) => {
  const handleLike = async () => {
    try {
        if(!liked_by.includes(uname)) {
            await handleLikeClick(msgId, text, like_count, liked_by, user)
        }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className={`message p-3 rounded ${isCurrentUser ? 'msg-right' : 'msg-left'}`}>
        {isCurrentUser ? 
            <div className="d-flex align-items-center bg-dark bg-opacity-75 mb-1 p-0 rounded"> 
                <p className="text-light m-0 mx-3">{user}</p> 
                <p className="bg-dark p-3 rounded-circle m-3 text-light"> {user.charAt(0).toUpperCase()} </p> 
            </div> : 
            <div className="d-flex align-items-center bg-dark bg-opacity-75 mb-1 p-0 rounded"> 
                <p className="bg-dark p-3 rounded-circle m-3"> {user.charAt(0).toUpperCase()} </p> 
                <p className="text-light m-0 mx-3">{user}</p> 
            </div>
        }
      <div className="message-text">{text}</div>
      <div onClick={handleLike} className="like">
        <span className={liked_by.includes(uname) ? 'liked' : 'text-light'}>like</span> {like_count}
      </div>
    </div>
  );
};




