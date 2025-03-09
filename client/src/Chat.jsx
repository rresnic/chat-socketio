import { useEffect, useState } from "react";

const Chat = ({socket, username, room}) => {
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (message !== "") {
            const messageData = {
                room,
                author: username,
                message,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };
            await socket.emit("send_message", messageData);
            setMessageList((prev) => [...prev, messageData])
        }
    }

    useEffect(()=>{
        const messageHandler = (data) => {
            setMessageList((prev) => [...prev, data]);
            console.log(data)
        }
        socket.on("receive_message", messageHandler);
        
        return () => {
            socket.off("receive_message", messageHandler);
        }
    }, [socket])

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>{room}</p>
            </div>
            <div className="chat-body">
                {
                    messageList.map((messageContent) => {
                        return (<div className="message" id={username === messageContent.author? "you" : "other"}>
                                    <div className="message-content"><p>{messageContent.message}</p></div>
                                    <div className="message-meta">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">{messageContent.author}</p>
                                    </div>
                                    
                                </div>);
                    })
                }
            </div>
            <div className="chat-footer">
                <input type="text" placeholder="..." onChange={(e)=> {
                    setMessage(e.target.value)
                }} />
                <button onClick={sendMessage} >&#9658;</button>
            </div>
        </div>
    )
}
export default Chat;