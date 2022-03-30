import './ChatBox.scss';
import React, { useEffect,useState } from "react";
import { MessagesContainer } from "./MessagesContainer";
import { Input } from "./Input";

export default function ChatBox({socket, height, users}) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [theme, setTheme] = useState('');

    useEffect(() => {
        if (localStorage.getItem('theme')) {
            setTheme(localStorage.getItem('theme'));
        }
        document.addEventListener('themeChange', () => {
            setTheme(localStorage.getItem('theme'));
        });

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
        <div className='chatbox-wrapper'>
            <div className={theme === 'dark' ? 'header-wrapper-dark' : 'header-wrapper'}>
                <div className="header">Chat</div>
            </div>
            <div className="chatbox" style={{height: height - 40}}>
                <MessagesContainer messages={messages} users={users} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    )
}