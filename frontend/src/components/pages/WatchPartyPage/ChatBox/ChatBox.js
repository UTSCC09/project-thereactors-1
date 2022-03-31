import './ChatBox.scss';
import React, { useEffect,useState } from "react";
import { MessagesContainer } from "./MessagesContainer";
import { Input } from "./Input";
import { getSocket } from 'components/utils/socket_utils';

export default function ChatBox({ height, users, messages}) {
    const [message, setMessage] = useState('');
    const [theme, setTheme] = useState('');

    useEffect(() => {
        if (localStorage.getItem('theme')) {
            setTheme(localStorage.getItem('theme'));
        }
        document.addEventListener('themeChange', () => {
            setTheme(localStorage.getItem('theme'));
        });
        getSocket().on("test",()=>{
            console.log("here");
        });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
        setMessage('')
        if (message) {
            getSocket().emit('send', message);
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