import React, { useEffect } from "react";
import { Message } from "./Message";

export const MessagesContainer = ({ messages, users }) => {
    const getAvatar = (username) => {
        return users[users.findIndex(user => user.username === username)].avatar;
    }

    return (
        <div className="messages">
            <div>
            {messages.map((message, i) => <div key={i}><Message message={message} avatar={getAvatar(message.sender)}/></div>)}
            </div>
        </div>
    )
}