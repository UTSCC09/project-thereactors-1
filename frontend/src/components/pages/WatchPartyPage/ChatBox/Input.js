import React from 'react';
import { Button } from '@mui/material';


export const Input = ({ message, setMessage, sendMessage }) => (
    <form className="form chat-form">
        <textarea
            className="input"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
        />
        <Button classname="send-button">Send</Button>
    </form>
);