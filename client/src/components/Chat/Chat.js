import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import './Chat.css'

import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'

import Cards from '../Cards/Cards'
import Actions from '../Actions/Actions'
import Community from '../Community/Community'

import table from '../../icons/table.png'

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')

    const [hands, setHands] = useState([])
    const [hand, setHand] = useState([])
    const [chips, setChips] = useState(2000)
    const [pot, setPot] = useState(0)
    const [river, setRiver] = useState([])
    const [turn, setTurn] = useState([])
    const [flop, setFlop] = useState([])
    const [play, setPlay] = useState(false)

    const ENDPOINT = 'localhost:5000'

    useEffect(() => {
        const { name, room } = queryString.parse(location.search)

        socket = io(ENDPOINT)

        setName(name)
        setRoom(room)

        socket.emit('join', { name, room }, (error) => {
            if(error) {
                alert(error)
            }
        })

        return () => {
            socket.emit('disconnect')
            socket.off()
        }
    }, [ENDPOINT, location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages(messages => [...messages, message])
        })

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        })

        socket.on('hand', ({ card1, card2 }) => {
            setHand([card1, card2])
        })

        socket.on('hands', ({ user, card1, card2 }) => {
            setHands(hands => [...hands, [user, card1, card2]])
        })

        socket.on('river', ({ card1, card2, card3 }) => {
            setRiver([card1, card2, card3])
        })

        socket.on('turn', ({ card }) => {
            setTurn([card])
        })

        socket.on('flop', ({ card }) => {
            setFlop([card])
        })

        socket.on('chips', (chips) => {
            setChips(chips)
        })

        socket.on('pot', (pot) => {
            setPot(pot)
        })

        socket.on('player', (player) => {

        })

        socket.on('start', () => {
            
        })

        socket.on('playTurn', () => {

        })
    }, [])


    const sendMessage = (event) => {
        event.preventDefault();
        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    const generateNewHand = () => {
        socket.emit('getNewHand')
    }

    const turnRiver = () => {
        socket.emit('getRiver')
    }

    const turnTurn = () => {
        socket.emit('getTurn')
    }

    const turnFlop = () => {
        socket.emit('getFlop')
    }

    const round = () => {
        socket.emit('round')
    }

    return (
        <div className="outerContainer">
            <TextContainer users={users} />
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <div className="game">
                <img className="table" src={table} alt="table" />
                <Actions generateNewHand={round} />
                <Cards chips={chips} hand={hand} />
                <Community river={river} turn={turn} flop={flop} />
            </div>
        </div>
    )
}

export default Chat;