import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';

export const Input = ({ message, setMessage, sendMessage }) => {
    const [theme, setTheme] = useState('');

    useEffect(() => {
        if (localStorage.getItem('theme')) {
            setTheme(localStorage.getItem('theme'));
        }
        document.addEventListener('themeChange', () => {
            setTheme(localStorage.getItem('theme'));
        });
    })

    return (
        <form onSubmit={(e)=>sendMessage(e)} className="chat-form">
            <TextField
                size='small'
                className={theme === 'dark' ? "message-input textfield-dark" : "message-input"}
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
                multiline
                fullWidth
                maxRows={1}
            />
            <Button type='submit' variant='outlined' className="send-button">Send</Button>
        </form>
    )
}