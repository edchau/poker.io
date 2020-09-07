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

import S2 from '../../icons/cards/2S.png'
import C2 from '../../icons/cards/2C.png'
import D2 from '../../icons/cards/2D.png'
import H2 from '../../icons/cards/2H.png'
import S3 from '../../icons/cards/3S.png'
import C3 from '../../icons/cards/3C.png'
import D3 from '../../icons/cards/3D.png'
import H3 from '../../icons/cards/3H.png'
import S4 from '../../icons/cards/4S.png'
import C4 from '../../icons/cards/4C.png'
import D4 from '../../icons/cards/4D.png'
import H4 from '../../icons/cards/4H.png'
import S5 from '../../icons/cards/5S.png'
import C5 from '../../icons/cards/5C.png'
import D5 from '../../icons/cards/5D.png'
import H5 from '../../icons/cards/5H.png'
import S6 from '../../icons/cards/6S.png'
import C6 from '../../icons/cards/6C.png'
import D6 from '../../icons/cards/6D.png'
import H6 from '../../icons/cards/6H.png'
import S7 from '../../icons/cards/7S.png'
import C7 from '../../icons/cards/7C.png'
import D7 from '../../icons/cards/7D.png'
import H7 from '../../icons/cards/7H.png'
import S8 from '../../icons/cards/8S.png'
import C8 from '../../icons/cards/8C.png'
import D8 from '../../icons/cards/8D.png'
import H8 from '../../icons/cards/8H.png'
import S9 from '../../icons/cards/9S.png'
import C9 from '../../icons/cards/9C.png'
import D9 from '../../icons/cards/9D.png'
import H9 from '../../icons/cards/9H.png'
import S10 from '../../icons/cards/10S.png'
import C10 from '../../icons/cards/10C.png'
import D10 from '../../icons/cards/10D.png'
import H10 from '../../icons/cards/10H.png'
import S11 from '../../icons/cards/11S.png'
import C11 from '../../icons/cards/11C.png'
import D11 from '../../icons/cards/11D.png'
import H11 from '../../icons/cards/11H.png'
import S12 from '../../icons/cards/12S.png'
import C12 from '../../icons/cards/12C.png'
import D12 from '../../icons/cards/12D.png'
import H12 from '../../icons/cards/12H.png'
import S13 from '../../icons/cards/13S.png'
import C13 from '../../icons/cards/13C.png'
import D13 from '../../icons/cards/13D.png'
import H13 from '../../icons/cards/13H.png'
import S1 from '../../icons/cards/1S.png'
import C1 from '../../icons/cards/1C.png'
import D1 from '../../icons/cards/1D.png'
import H1 from '../../icons/cards/1H.png'

const hearts = [H1, H2, H3, H4, H5, H6, H7, H8, H9, H10, H11, H12, H13]
const spades = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13]
const clubs = [C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12, C13]
const diamonds = [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13]

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')

    const [hand, setHand] = useState([])
    const [chips, setChips] = useState([2000])
    const [pot, setPot] = useState(0)
    const [river, setRiver] = useState([])
    const [turn, setTurn] = useState([])
    const [flop, setFlop] = useState([])
    const [play, setPlay] = useState([])

    const [handSuits, setHandSuits] = useState([])
    const [flopSuits, setFlopSuits] = useState([])
    const [turnSuits, setTurnSuits] = useState([])
    const [riverSuits, setRiverSuits] = useState([])

    const [start, setStart] = useState([true])

    const ENDPOINT = 'localhost:5000'

    useEffect(() => {
        const { name, room } = queryString.parse(location.search)

        socket = io(ENDPOINT)

        setName(name)
        setRoom(room)

        // make new object with card and imports

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

        socket.on('hand', (hand) => {
            const { card1, card2 } = hand
            var suit1 = hearts
            var suit2 = hearts

            setHand([hand])

            if(card1.suit === 'spade') {
                suit1 = spades
            } else if (card1.suit === 'club') {
                suit1 = clubs
            } else if (card1.suit === 'diamond') {
                suit1 = diamonds
            }
            if(card2.suit === 'spade') {
                suit2 = spades
            } else if (card2.suit === 'club') {
                suit2 = clubs
            } else if (card2.suit === 'diamond') {
                suit2 = diamonds
            }

            setHandSuits([suit1, suit2])
        })

        socket.on('callRiver', () => {
            socket.emit('getRiver')
        })

        socket.on('callTurn', () => {
            socket.emit('getTurn')
        })

        socket.on('callFlop', () => {
            socket.emit('getFlop')
        })

        socket.on('river', ({ card5 }) => {
            setRiver([card5])

            var suit1 = hearts

            if(card5.suit === 'spade') {
                suit1 = spades
            } else if (card5.suit === 'club') {
                suit1 = clubs
            } else if (card5.suit === 'diamond') {
                suit1 = diamonds
            }

            setRiverSuits([suit1])
        })

        socket.on('turn', ({ card4 }) => {
            setTurn([card4])

            var suit1 = hearts

            if(card4.suit === 'spade') {
                suit1 = spades
            } else if (card4.suit === 'club') {
                suit1 = clubs
            } else if (card4.suit === 'diamond') {
                suit1 = diamonds
            }

            setTurnSuits([suit1])
        })

        socket.on('flop', ({ card1, card2, card3 }) => {
            setFlop([card1, card2, card3])

            var suit1 = hearts
            var suit2 = hearts
            var suit3 = hearts

            if(card1.suit === 'spade') {
                suit1 = spades
            } else if (card1.suit === 'club') {
                suit1 = clubs
            } else if (card1.suit === 'diamond') {
                suit1 = diamonds
            }
            if(card2.suit === 'spade') {
                suit2 = spades
            } else if (card2.suit === 'club') {
                suit2 = clubs
            } else if (card2.suit === 'diamond') {
                suit2 = diamonds
            }
            if(card3.suit === 'spade') {
                suit3 = spades
            } else if (card3.suit === 'club') {
                suit3 = clubs
            } else if (card3.suit === 'diamond') {
                suit3 = diamonds
            }

            setFlopSuits([suit1, suit2, suit3])
        })
        
        socket.on('reset', () => {
            setRiver([])
            setTurn([])
            setFlop([])
            setPot(0)
            round()
        })

        socket.on('chips', (chips) => {
            setChips(chips)
        })

        socket.on('pot', (pot) => {
            setPot(pot)
        })

        socket.on('playTurn', (play) => {
            console.log("RESETTING PLAY")
            setPlay(play)
        })

        socket.on('start', () => {
            setStart([])
        })

        socket.on('callHand', (user) => {
            socket.emit('getNewHand', user)
        })
        
    }, [])


    const sendMessage = (event) => {
        event.preventDefault();
        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    const check = () => {
        socket.emit('next')
    }

    const call = () => {
        socket.emit('next')
    }

    const raise = () => {
        socket.emit('next')
    }

    const fold = () => {
        socket.emit('next')
    }

    const round = () => {
        setStart([true])
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
                <Actions round={round} start={start} check={check} call={call} raise={raise} 
                    fold={fold} play={play} />
                <Cards chips={chips[0]} hand={hand} deck1={handSuits[0]} deck2={handSuits[1]}/>
                <Community flop={flop} turn={turn} river={river} deck1={flopSuits[0]} 
                    deck2={flopSuits[1]} deck3={flopSuits[2]} deck4={turnSuits[0]} 
                    deck5={riverSuits[0]} />
            </div>
        </div>
    )
}

export default Chat;