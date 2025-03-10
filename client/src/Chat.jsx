import { useEffect, useState } from "react";
import BlobImage from "./BlobImage";

const Chat = ({socket, username, room}) => {
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [file, setFile] = useState();

    const handleSelectFile = (e) =>{
        setMessage((prev) => `prev ${e.target.files[0].name}`);
        setFile(e.target.files[0]);
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if (file) {
            const messageObject = {
                author: username,
                room,
                type: "file",
                message: file,
                fileType: file.type,
                fileName: file.name,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };
            setMessage("");
            setFile();
            socket.emit("send_message", messageObject)
        } else {
            if (message !== "") {
                const messageObject = {
                    author: username,
                    room,
                    message,
                    type: "text",
                    time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                }
                setMessage("");
                setFile();
                socket.emit("send_message", messageObject)
            }
        }
    }
    useEffect(()=>{
        const messageHandler = (data) => {
            setMessageList((prev) => [...prev, data]);
        }
        socket.on("receive_message", messageHandler);
        
        return () => {
            socket.off("receive_message", messageHandler);
        }
    }, [socket])

    const displayMessages = (messageContent, index) => {
        console.log(messageContent);
        if(messageContent.type === "file") {
            const blob = new Blob([messageContent.message], {type: messageContent.fileType});
            return (
                <div className="message" key={index} id={username === messageContent.author? "you" : "other"}>
                    <div className="message-content"><p><BlobImage blob={blob} filename={message.fileName}/></p></div>
                    <div className="message-meta">
                        <p id="time">{messageContent.time}</p>
                        <p id="author">{messageContent.author}</p>
                    </div>
                    
                </div>
                );
        } else if(messageContent.type === "text") {
            return (
                <div className="message" key={index} id={username === messageContent.author? "you" : "other"}>
                    <div className="message-content"><p>{messageContent.message}</p></div>
                    <div className="message-meta">
                        <p id="time">{messageContent.time}</p>
                        <p id="author">{messageContent.author}</p>
                    </div>
                    
                </div>
                );
        }
        return (<p className="error-text">Invalid message type received</p>);
        
    }


    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>{room}</p>
            </div>
            <div className="chat-body">
                {messageList.map(displayMessages)}
            </div>
            <div className="chat-footer">
                <input type="text" placeholder="..." onChange={(e)=> {
                    setMessage(e.target.value)
                }} />
                <input type="file" onChange={(e) =>handleSelectFile(e)} name={"fileField"} />
                <button onClick={(e)=>sendMessage(e)} >&#9658;</button>
            </div>
        </div>
    )
}
export default Chat;