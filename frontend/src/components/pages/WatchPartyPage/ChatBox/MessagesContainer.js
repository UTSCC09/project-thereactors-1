import React, { useEffect } from "react";
import { Message } from "./Message";

export const MessagesContainer = ({ messages, curr_user }) => {
    return(
        <div className="messages">
            <div>
            {messages.map((message, i) => <div key={i}><Message message={message}/></div>)}
            </div>
        </div>
    )
}