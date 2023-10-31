import React, {useState, useEffect} from 'react'
import io from "socket.io-client"

const socket = io("http://localhost:4000")

export const ChatClient = () => {

    const [message, setMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [listMessages, setListMessages] = useState([{
        body: "Bienvenido al chat",
        user: "CPU",
    }]);

    const handleSubmit = (event) => {
        event.preventDefault();
        socket.emit("message", {body: message, user: userName});

        const newMsg = {
            body: message,
            user: userName
        };

        setListMessages([...listMessages, newMsg]);
        setMessage('');
    }

    useEffect(() => {
      const receiveMessage = msg => {
        setListMessages([...listMessages, msg])
      }

      socket.on('message', receiveMessage)
    
      return () => {
        socket.off('message', receiveMessage)
      }
    }, [listMessages]);
    

  return (
    <>
    <input onChange={event => setUserName(event.target.value)} className='txt-username' type='text' />
    <div className='div-chat'>
        {
            listMessages.map((message, idx) => (
                <p key={message+idx}>{message.user}: {message.body}</p>
            ))
        }
        <form onSubmit={handleSubmit} className='form'>
            <span className='title'>Chat-io</span>
            <p className='description'>Type your message.</p>
            <div className='div-type-chat'>
                <input 
                value={message} 
                placeholder='Type your message' 
                onChange={ e => setMessage(e.target.value)} 
                type="text" 
                name="text" 
                id="chat-message" 
                className='input-style'
                />
                <button type="submit">Enviar</button>
            </div>
        </form>
    </div>
    </>
  )
}
