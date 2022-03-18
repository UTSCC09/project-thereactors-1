import { Avatar } from "@mui/material";
import React, { useState, useEffect } from "react";
import * as authAPI from 'auth/auth_utils';

export const Message = ({ message: { sender, content } })  => {
    const isSelf = () => {
        return authAPI.getUser == sender;
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

