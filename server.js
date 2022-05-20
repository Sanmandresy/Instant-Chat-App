const express = require("express");
const path = require("path");
const http = require("http");
const app = express();
const server = http.createServer(app);
const {instrument} = require("@socket.io/admin-ui");
const PORT = process.env.PORT || 501;

const io = require("socket.io")(server,{
    cors:{
        origin:[`http://localhost:${PORT}`,"https://admin.socket.io"],
        credentials:true
    }
});

//To render our html and css and js
app.use(express.static(path.join(__dirname,"client")));

//Run when someone is connected

//List of users.
const users = {};


io.on("connection", socket => {
    console.log("New user connected to the chat"); // for admin
    //joining a room
    socket.on("join-room", room  => {
        socket.join(room);
        //new-user
        socket.on("new-user", username => {
            users[socket.id] = username;
            socket.broadcast.to(room).emit("user-connected", username);
            console.log(`${username} has joined the chat room : ${room}`); // admin
            console.table(users); // admin
        })

        //when sending message
        socket.on("send-chat-message", message => {
            socket.broadcast.to(room).emit("chat-message",{message : message , username : users[socket.id]});
            console.log(`${users[socket.id]}: "${message}" (${room})`); // admin
        })
        //logout user
        socket.on("disconnect", () => {
            socket.broadcast.to(room).emit("user-disconnected", users[socket.id])
            console.log(`${users[socket.id]} has left the chat room : ${room}`); // admin
            delete  users[socket.id];
            console.table(users); // admin
        })
    })
    
});


//Using socket.io admin UI
instrument(io,{
    auth:false
})


server.listen(PORT, () => {
    console.log(`Server running and listening on port ${PORT}`); // admin
})