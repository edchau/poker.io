const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js')

const PORT = process.env.PORT || 5000

const router = require('./router')
const users = require('./users.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(router)

deck = ['twoC', 'twoD', 'twoS', 'twoH']

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room })

        if(error) return callback(error)

        socket.emit('message', {user: '', text: `Hi ${user.name}! Welcome to poker.io! Type \'/start\' to begin the game.`})
        socket.broadcast.to(user.room).emit('message', {user: '', text: `${user.name} has joined.`})

        socket.join(user.room)

        io.to(user.room).emit('roomData', {room:user.room, users:getUsersInRoom(user.room)})

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        if(message === '/start') {
            socket.broadcast.to(user.room).emit('start')
        }

        io.to(user.room).emit('message', {user: user.name, text: message})

        callback()
    })

    socket.on('getNewHand', () => {
        const user = getUser(socket.id)

        io.to(socket.id).emit('hand', {card1: 'twoC', card2: 'twoD'})
        io.to(user.room).emit('hands', {user: user.name, card1: 'twoC', card2: 'twoD'})
        io.to(user.room).emit('message', {user: '', text: `${user.name} has twoC and twoD.`})
    })

    socket.on('setPot', (pot) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('pot', pot)
    })

    socket.on('setChips', (chips) => {
        io.to(socket.id).emit('pot', chips)
    })

    socket.on('getRiver', () => {
        const user = getUser(socket.id)
        console.log('Hi')
        io.to(user.room).emit('river', {card1: 'twoC', card2: 'twoD', card3: 'twoD'})
        io.to(user.room).emit('message', {user: '', text: `River`})
    })

    socket.on('getTurn', () => {
        const user = getUser(socket.id)

        io.to(user.room).emit('turn', {card: 'twoC'})
        io.to(user.room).emit('message', {user: '', text: `Turn`})
    })

    socket.on('getFlop', () => {
        const user = getUser(socket.id)

        io.to(user.room).emit('flop', {card: 'twoC'})
        io.to(user.room).emit('message', {user: '', text: `Flop`})
    })

    socket.on('round', () => {
        const user = getUser(socket.id)
        var users = getUsersInRoom(user.room)
        users.forEach(uid => {
            console.log(uid)
        })
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', {user:'', text:`${user.name} has left.`})
            io.to(user.room).emit('roomData', {room:user.room, users:getUsersInRoom(user.room)})
        }
    })
})

server.listen(PORT, () => {
    console.log(`Server has start on port ${PORT}`)
})