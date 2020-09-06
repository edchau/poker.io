const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js')

const PORT = process.env.PORT || 5000

const router = require('./router')
const users = require('./users')
const poker = require('./poker')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(router)

// deck = ['twoC', 'twoD', 'twoS', 'twoH']

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room })

        if(error) return callback(error)

        socket.emit('message', {user: '', text: `Hi ${user.name}! Welcome to poker.io!`})
        socket.broadcast.to(user.room).emit('message', {user: '', text: `${user.name} has joined.`})

        socket.join(user.room)

        if(getUsersInRoom(user.room).length == 1) {
            io.to(socket.id).emit('start')
        }

        io.to(user.room).emit('roomData', {room:user.room, users:getUsersInRoom(user.room)})

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('message', {user: user.name, text: message})

        callback()
    })

    socket.on('getNewHand', (user) => {
        const hand = poker.generateHand()
        io.to(user.id).emit('hand', hand)
    })

    socket.on('setPot', (pot) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('pot', pot)
    })

    socket.on('setChips', (chips) => {
        io.to(socket.id).emit('chips', chips)
    })

    socket.on('getFlop', () => {
        const user = getUser(socket.id)

        const flop = poker.generateFlop()
        console.log(flop)

        io.to(user.room).emit('flop', flop)
    })

    socket.on('getTurn', () => {
        const user = getUser(socket.id)

        const turn = poker.generateTurn()
        console.log(turn)

        io.to(user.room).emit('turn', turn)
    })

    socket.on('getRiver', () => {
        const user = getUser(socket.id)

        const river = poker.generateRiver()
        console.log(river)

        io.to(user.room).emit('river', river)
    })

    socket.on('next', () => {
        const user = getUser(socket.id)
        io.to(socket.id).emit('playTurn', [])
        var nextUser = poker.getNextPlayer()
        if (nextUser == null) {
            const round = poker.getRoundCount()
            console.log(round)
            if (round == 1) {
                socket.emit('callFlop')
            } else if (round == 2) {
                socket.emit('callTurn')
            } else if (round == 3) {
                socket.emit('callRiver')
            } else if (round == 4) {
                const users = getUsersInRoom(user.room)

                users.forEach(u => {
                    io.to(u.id).emit('playTurn', [])
                })
        
                console.log("WIN")

                io.to(user.room).emit('reset')
            }
            nextUser = poker.getNextPlayer()
        }
        if (nextUser != null) {
            io.to(nextUser.id).emit('playTurn', [true])
        }
    })

    socket.on('round', () => {
        const user = getUser(socket.id)
        poker.getStartingPlayers(user.room)
        const users = getUsersInRoom(user.room)
        const next = poker.getNextPlayer()

        users.forEach(u => {
            socket.emit('callHand', u)
        })

        io.to(next.id).emit('playTurn', [true])
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