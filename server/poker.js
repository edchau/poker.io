const users = require('./users')

const cards = []
var cardsUsed = []

var activePlayers = [] // { id, username, room }
var ind = 0
var used = []
var community = []
var pot = 0

const restart = () => {
    // reset game after each play
}

const fold = () => {
    //  remove player from active players
}

const generateHand = () => {
    // generates new hand (two cards)
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

module.exports = { getStartingPlayers, getNextPlayer }