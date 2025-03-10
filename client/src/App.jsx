import { useState } from 'react';
import './App.css';
import './styles/custom-app.css';
import io from 'socket.io-client';
import Chat from './Chat2';

const socket = io.connect("http://localhost:3003");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("")
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);


    }
  }
  return (
    <>
      <div className='App'>
        <div className='joinChatContainer'>
          <h3>Join a chat</h3>
          <input type='text' placeholder='John' name={"nameField"} onChange={(e) => setUsername(e.target.value)} />
          <input type='text' placeholder='Room Id...' name={"roomField"} onChange={(e) => setRoom(e.target.value)} />
          <button type='button' onClick={joinRoom}>Join a room</button>
        </div>
        <Chat socket={socket} username={username} room={room} />
      </div>
    </>
  )
}

export default App
