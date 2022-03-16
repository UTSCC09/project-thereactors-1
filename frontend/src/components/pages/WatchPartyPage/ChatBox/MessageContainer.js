import React, { useEffect } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';
import { Message } from "./Message";

export const MessageContainer = ({ messages, curr_user }) => {
    return(
    <ScrollToBottom className="messages">
        {messages.map((message, i) => <div key={i}><Message message={message} curr_user={curr_user}/></div>)}
    </ScrollToBottom>
    )
}