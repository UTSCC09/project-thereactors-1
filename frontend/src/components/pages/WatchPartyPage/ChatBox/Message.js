import { Avatar } from "@mui/material";
import React, { useState, useEffect } from "react";

export const Message = ({ message: { sender, content }, current_user })  => {
    const isSelf = () => {
        return current_user == sender;
    }

    return (
        !isSelf ? (
            <div className="message-container-other">
                <div className="inner-box">
                <Avatar className="user-icon" />
                <div className="message-box">
                    <div className="sender"><b>{sender}</b></div>
                    <div className="message-text">{content}</div>
                </div>
                </div>
            </div>
        ) : (
            <div className="message-container-self">
                <div></div>
                <div className="inner-box">
                <div className="message-box">
                    <div className="sender"><b>{sender}</b></div>
                    <div className="message-text">{content}</div>
                </div>
                <Avatar className="user-icon" />
                </div>
            </div>
        )
    )
}

