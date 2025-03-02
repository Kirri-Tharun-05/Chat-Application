const path= require('path');
const http=require('http');
const express=require('express');
const socketIo=require('socket.io');
const port= 3000;

const app=express();
const server= http.createServer(app);
const io=socketIo(server);

const publicPath=path.join(__dirname,'../public');

io.on('connection',(socket)=>{
    console.log('User connected');
})

app.use(express.static(publicPath));

app.listen(port,()=>{
    console.log(`listening to the server port ${port}`)
})