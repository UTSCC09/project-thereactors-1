import React, { useEffect,useState } from "react";
import { MessageContainer } from "./MessageContainer";
import { Input } from "./Input";
import './Message.scss';

export default function ChatBox({socket}) {
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
        <div className="chatbox">
            <MessageContainer className="" messages={messages} curr_user={curr_user} />
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
    )
}