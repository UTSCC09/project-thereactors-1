import React, { useEffect, useState } from "react";
import ChatBox from "./ChatBox/ChatBox";
import io from 'socket.io-client';
import config from 'environments';
const socket = io.connect(config.backendUrl);
socket.emit('join-room',"blah");

export default function WatchPartyPage() {
    return (
        <div>WatchParty Page
        <ChatBox socket={socket}></ChatBox>

        </div>
    );
}