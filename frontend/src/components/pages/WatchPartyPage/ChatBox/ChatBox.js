import './ChatBox.scss';
import React, { useEffect,useState } from "react";
import { MessagesContainer } from "./MessagesContainer";
import { Input } from "./Input";

export default function ChatBox({socket, height}) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const curr_user ="victor";
    useEffect(() => {
        socket.on("test",()=>{
            console.log("here");
        });
        socket.on("receive",data => {
            setMessages(msgs=>[...msgs,data]);
        });
        socket.on("joined",chat_history => {
            setMessages(()=>[...chat_history]);
        });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
        setMessage('')
        if (message) {
            socket.emit('send', message);
        }
    }

    return (
        <div className="chatbox" style={{height: height - 16}}>
            <MessagesContainer messages={messages} curr_user={curr_user} />
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
    )
}