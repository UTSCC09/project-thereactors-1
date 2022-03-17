import React from 'react';
import { Button, TextField } from '@mui/material';

export const Input = ({ message, setMessage, sendMessage }) => (
    <form onSubmit={(e)=>sendMessage(e)} className="chat-form">
        <TextField
            size='small'
            className="message-input"
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
);