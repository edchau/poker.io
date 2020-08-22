const users = require('./users')

var deck = [] // {rank, suit} -- DO NOT REMOVE ITEMS FROM THIS
var cardsInPlay = Array.from(Array(52).keys()) // list of indices of deck
const suits = ["spade", "diamond", "club", "heart"]
const ranks = [1,2,3,4,5,6,7,8,9,10,11,12,13]

// populate deck
//suits.forEach(suit => ranks.forEach(rank => ))

for (var s in suits) {
    for (r in ranks) {
        deck.push({name: "" + r + suits[s].substring(0,1).toUpperCase(), rank : parseInt(r), suit : suits[s]})
    }
}

var activePlayers = [] // { id, username, room }
var ind = 0
var used = []
var community = []
var pot = 0


const restart = () => {
    // reset game after each play
}

const fold = (id) => {
    //  remove player from active players
    const index = activePlayers.findIndex((player) => player.id === id)
    
    if (index !== -1) {
        activePlayers.splice(index, 1)[0]
    }
}

const generateHand = () => {
    // generates new hand (two cards)
    const random1 = Math.floor(Math.random() * cardsInPlay.length)
    cardsInPlay.splice(random1, 1)
    const random2 = Math.floor(Math.random() * cardsInPlay.length)
    cardsInPlay.splice(random2, 1)
    return {card1: deck[random1], card2: deck[random2]} 
}

const generateRiver = () => {
    // generate 3 river cards for community
}

const generateOneCommunity = () => {
    // generate 1 card for turn/flop
}

const Winner = () => {
    // determine winner given user, cards, and community cards
}

const checkTypeWin = () => {
    // check type of win
}

const getPot = () => {
    // get value of pot
}

const addToPot = () => {
    // add chips to pot
}

const getStartingPlayers = (room) => {
    // get active players that still have cards
    activePlayers = users.getUsersInRoom(room)
}

const getNextPlayer = () => {
    active = activePlayers[ind]
    ind += 1
    return active
}

// unit tests
console.log(generateHand()) // 2 random cards

//module.exports = { getStartingPlayers, getNextPlayer }