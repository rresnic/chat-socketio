import { useEffect, useState } from "react";
import BlobImage from "./BlobImage2"; // Component for displaying images

const Chat = ({ socket, username, room }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [files, setFiles] = useState([]);
  
  const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/x-icon']; // Allowed file types
  
  const handleSelectFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter((file) => allowedFileTypes.includes(file.type));

    if (validFiles.length === 0) {
      alert("Please select valid image files (PNG, JPG, JPEG, GIF, SVG, ICO).");
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if(files.length === 0 && message === "") return;
    
    let messageObject = {
      author: username,
      room,
      type: "text",
      message,
      time: new Date().toLocaleTimeString(),
    };

    // If files are selected, add them to the message
    if (files.length > 0) {
      messageObject.type = "file";
      messageObject.files = files.map(file => ({
        name: file.name,
        type: file.type, 
        data: file, 
      }));
    }

    // Send the message (with or without files) to the server
    socket.emit("send_message", messageObject);

    setMessage("");
    setFiles([]);

    document.getElementById("fileInput").value = ""; // clear the input field label (it's already empty, but it still displays the old filename)

  };

  // Receive messages (including files) from the server
  useEffect(() => {
    const messageHandler = (data) => {
      setMessageList((prev) => [...prev, data]);
    };

    socket.on("receive_message", messageHandler);

    return () => {
      socket.off("receive_message", messageHandler);
    };
  }, [socket]);

  // Display messages (either text or files)
  const displayMessages = (messageContent, index) => {
    if (messageContent.type === "file") {
      return (
        <div className={`message ${messageContent.author === username ? "own-message" : "other-message"}`} key={index}>
            
            <div className="message-content">
                {messageContent.files.map((file, idx) => (
                    <div key={idx}>
                        <BlobImage file={file.data} fileType={file.type} fileName={file.name} />
                    </div>
                ))}
                {messageContent.message && messageContent.message.length > 0 && <p>{messageContent.message}</p>}
            </div>

          <div className="message-meta">
            <p id="time">{messageContent.time}</p>
            <p id="author">{messageContent.author}</p>
          </div>
        </div>
      );
    } else if (messageContent.type === "text") {
      return (
        <div className={`message ${messageContent.author === username ? "own-message" : "other-message"}`} key={index}>
          <div className="message-content">
            <p>{messageContent.message}</p>
          </div>
          <div className="message-meta">
            <p id="time">{messageContent.time}</p>
            <p id="author">{messageContent.author}</p>
          </div>
        </div>
      );
    }
    return <p className="error-text">Invalid message type received</p>;
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>{room}</p>
      </div>
      <div className="chat-body">
        {messageList.map(displayMessages)}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <input
          id="fileInput"
          type="file"
          onChange={handleSelectFiles}
          multiple
          accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml, image/x-icon"
        />
        {files.length > 0 && (
          <div>
            <p>Selected Files:</p>
            <ul>
              {files.map((file, idx) => (
                <li key={idx}>
                  {file.name}
                  <button onClick={() => handleRemoveFile(file.name)} style={{ marginLeft: "10px", cursor: "pointer" }}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;