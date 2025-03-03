const express = require('express');
const { createServer } = require('node:http');
const {Server} = require('socket.io');
const cors= require('cors');

const app = express();
const server = createServer(app);

const nameToSocketId=new Map();
const socketIdToName=new Map();
const io=new Server(server,{
  cors:true
});

io.on('connection',(socket)=>{
  console.log('Socket Connected : ',socket.id);
  socket.on('room-join',(data)=>{
    const {name,room} =data;
    nameToSocketId.set(name,socket.id)
    socketIdToName.set(socket.id,name)  
    console.log(data);
    io.to(room).emit('user-joined',{name , id:socket.id })
    socket.join(room);
    io.to(socket.id).emit('room-join',data); 
  })
})

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});