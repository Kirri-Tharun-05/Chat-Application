import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useSocket } from './SocketProvider';

import peer from '../service/peer';
const Screen = () => {
    const videoRef = useRef(null);
    const remoteRef=useRef(null);
    const [connectionId, setConnectionId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    const socket = useSocket();

    const handleUserJoined = useCallback(({ name, id }) => {
        console.log(`User : ${name} joined Room`)
        setConnectionId(id);
    }, [])

    const handleCall = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const offer = await peer.getOffer();
        socket.emit('user-call', { to: connectionId, offer })
        setMyStream(stream);
    }, [connectionId, socket]);

    const handleIncommingCall = useCallback(async ({ from, offer }) => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream);
        console.log('incomming call from : ', from);
        const ans = await peer.getAnswer(offer);
        setConnectionId(from);
        socket.emit('call-accepted', { to: from, ans });
    }, [socket])

    const handleCallAccepted = useCallback(({ from, ans }) => {
        console.log(ans);
        peer.setLocalDescription(ans);
        console.log('Call accepted');
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track,myStream);
        }
    }, [myStream])

    useEffect(() => {
        if (myStream) {
            videoRef.current.srcObject = myStream;
        }
    }, [myStream]);

    useEffect(()=>{
        peer.peer.addEventListener('track',async ev=>{
            const remoteStream=ev.streams;
            setRemoteStream(remoteStream);
        })
        if(remoteStream){
            remoteRef.current.srcObject=remoteStream;
        }

    })

    useEffect(() => {
        socket.on('user-joined', handleUserJoined);
        socket.on('incomming-call', handleIncommingCall);
        socket.on('call-accepted', handleCallAccepted);
        return () => {
            socket.off('user-joined', handleUserJoined)
            socket.off('incomming-call', handleIncommingCall)
            socket.off('call-accepted', handleCallAccepted);
        };
    }, [socket, handleUserJoined, handleIncommingCall])

    return (
        <div>
            <h1>Room page</h1>
            <h2>{connectionId ? 'Connected' : "You Are Not Connected"}</h2>
            {connectionId && <button onClick={handleCall}>Call</button>}
            {myStream && <h1>This Is My stream</h1>}
            {myStream && <video ref={videoRef} autoPlay muted></video>}
            {remoteStream && <h1>This Is Remote stream</h1>}
            {remoteStream && <video ref={remoteRef} autoPlay muted></video>}
        </div>

    )
}

export default Screen;