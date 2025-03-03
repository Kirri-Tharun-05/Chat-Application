import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useSocket } from './SocketProvider';

const Screen = () => {
    const videoRef = useRef(null);
    const [connectionId, setConnectionId] = useState(null);
    const [myStream, setMyStream] = useState();
    const socket = useSocket();
    const handleUserJoined = useCallback(({ name, id }) => {
        console.log(`User : ${name} joined Room`)
        setConnectionId(id);
    }, [])

    const handleCall = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream);
    }, []);
    useEffect(() => {
        if (myStream) {
            videoRef.current.srcObject = myStream;
        }
    }, [myStream]);
    useEffect(() => {
        socket.on('user-joined', handleUserJoined);
        return (() => socket.off('user-joined', handleUserJoined))
    }, [socket, handleUserJoined])
    return (
        <div>
            <h1>Room page</h1>
            <h2>{connectionId ? 'Connected' : "You Are Not Connected"}</h2>
            {connectionId && <button onClick={handleCall}>Call</button>}
            {myStream && <video ref={videoRef} autoPlay muted style={{ width: '10rem', height: "10rem" }}></video>}
        </div>

    )
}

export default Screen;