const express = require("express")
const path = require('path')
const http = require('http');//for socket
const socketio = require('socket.io');//for socket
const formatMessage = require('./utils/formatMessage.js')
const { userJoin, getCurrentUser, userLeaves, getRoomUsers } = require('./utils/users.js')
const app = express()

//to set static folder
app.use(express.static(path.join(__dirname, 'public')))
const server = http.createServer(app)//for socket
const io = socketio(server)//for socket

const PORT = 3000 || process.env.PORT
const BotName = 'LetsChat Bot'

//Run when a client connects
io.on('connection', socket => {

    socket.on('joinroom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        socket.emit('message', formatMessage(BotName, 'Welcome to LetsChat!'))

        //Broadcast when a user joins a chat
        socket.broadcast.to(user.room).emit('message', formatMessage(BotName, `${user.username} has Joined the Chat`))

        //to show users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    //user sends a message
    socket.on('chatMessage', (msg) => {
        const currentUser = getCurrentUser(socket.id)
        io.to(currentUser.room).emit('message', formatMessage(currentUser.username, msg))
    })

    // when a user left the chat
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id)
        if (user) {
            io.to(user.room).emit('message', formatMessage(BotName, `${user.username} has Left the Chat`))
        }

        //to show users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

})

server.listen(PORT, (req, res) => {
    console.log(`Server Running on Port : ${PORT}`)
})