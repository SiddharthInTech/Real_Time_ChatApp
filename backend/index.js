const express = require('express')
const {Server} = require('socket.io');
const http = require("http");
const cors = require("cors")

const app = express();
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, { 
    cors: {
        origin: [
            "http://localhost:3000",
            "https://realtimechatapp-seven.vercel.app"
        ],
        
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    //console.log(socket.id); // x8WIv7-mJelg7on_ALbx

    socket.on("joinRoom", room => socket.join(room))

    socket.on("newMessage", ({newMessage, room})=>{
        //console.log(newMessage, room);
        io.in(room).emit("getLatestMessage", newMessage)

    })

  });
  

app.get("/", (req,res)=>{
    res.send("socket Backend is started");
})

server.listen(3001, ()=>{
    console.log("app is started in port 3001");
});

