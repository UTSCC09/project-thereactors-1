import React, { useState, useEffect } from "react";

// import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";



export const Message = ({ message: { sender, content }, current_user })  => {
    function isSelf() {
        return current_user._id == sender._id;
    }
    return (
        isSelf
            ? (
                <div className="messageContainer justifyEnd">
                    <div className="messageBox backgroundBlue" >
                        <p className="messageText colorWhite">{content}</p>
                    </div>
                </div>
            )
            : (
                <div className="messageContainer justifyStart">
                    <div className="messageBox backgroundLight">
                        <p className="messageText colorDark">{content}</p>
                    </div>
                </div>
            )

    )
}

