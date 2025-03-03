import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from './SocketProvider'
import { useNavigate } from 'react-router-dom'
import './index.css'
const Home = () => {

    const navigate =useNavigate();

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    const socket = useSocket();
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        socket.emit('room-join', { name, room });
        console.log({ name, room }); 
    }, [name, room, socket]);

    const handleJoinRoom = useCallback((data) => {
        const { name, room } = data;
        navigate(`/room/${room}`)
        console.log({name,room});
    }, [navigate]);

    useEffect(() => {
        socket.on('room-join', handleJoinRoom);
        return()=>{
            socket.off('room:join',handleJoinRoom);
        }
    }, [socket]);
    return (
        <>
            <div className="container">
                <input type="text" placeholder='Enter Your Name Here' onChange={(e) => { setName(e.target.value) }} />
                <input type="text" name="" id="" placeholder='Room Code' onChange={(e) => { setRoom(e.target.value) }} />
                <button type='button' onClick={handleSubmit}>Join</button>
            </div>

        </>
    )
}

export default Home;
