const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js')

const PORT = process.env.PORT || 5000

const router = require('./router')
const users = require('./users')
const poker = require('./poker')
const { Winner } = require('./poker')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(router)


const hearts = ["A♡", "2♡", "3♡", "4♡", "5♡", "6♡", "7♡", "8♡", "9♡", "10♡", "J♡", "Q♡", "K♡"]
const spades = ["A♤", "2♤", "3♤", "4♤", "5♤", "6♤", "7♤", "8♤", "9♤", "10♤", "J♤", "Q♤", "K♤"]
const clubs = ["A♧", "2♧", "3♧", "4♧", "5♧", "6♧", "7♧", "8♧", "9♧", "10♧", "J♧", "Q♧", "K♧"]
const diamonds = ["A♢", "2♢", "3♢", "4♢", "5♢", "6♢", "7♢", "8♢", "9♢", "10♢", "J♢", "Q♢", "K♢"]

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
        const hand = poker.generateHand(user.id)
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

        io.to(user.room).emit('flop', flop)
    })

    socket.on('getTurn', () => {
        const user = getUser(socket.id)

        const turn = poker.generateTurn()

        io.to(user.room).emit('turn', turn)
    })

    socket.on('getRiver', () => {
        const user = getUser(socket.id)

        const river = poker.generateRiver()

        io.to(user.room).emit('river', river)
    })

    socket.on('next', () => {
        const user = getUser(socket.id)
        io.to(socket.id).emit('playTurn', [])
        var nextUser = poker.getNextPlayer()
        let res = false
        if (nextUser == null) {
            const round = poker.getRoundCount()
            if (round == 1) {
                socket.emit('callFlop')
            } else if (round == 2) {
                socket.emit('callTurn')
            } else if (round == 3) {
                socket.emit('callRiver')
            } else if (round == 4) {
                const users = getUsersInRoom(user.room)

                users.forEach(u => {
                    console.log(u)
                    io.to(u.id).emit('playTurn', [])
                })
        
                var w = Winner()
                var wid = w.id
                var winner = getUser(wid)
                console.log("WINNER: ", w)

                // convert to card string
                io.to(user.room).emit('message', {user: "", text: winner.name + " won with "})

                io.to(user.room).emit('reset')
                res = true
            }
            if (!res) {
                nextUser = poker.getNextPlayer()
            }
        }
        if (!res && nextUser != null) {
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
        console.log(getUser(next.id))
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