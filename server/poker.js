const users = require('./users')

var deck = [] // {rank, suit} -- DO NOT REMOVE ITEMS FROM THIS
var cardsInPlay = Array.from(Array(52).keys()) // list of indices of deck
const suits = ["spade", "diamond", "club", "heart"]
const ranks = [1,2,3,4,5,6,7,8,9,10,11,12,13]

// populate deck
for (s in suits) {
    for (r in ranks) {
        deck.push({rank : parseInt(r), 
                   suit : suits[s]})
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

const generateFlop = () => {
    // generate 3 cards for the flop
    return {card1: generateOneCommunity(), 
            card2: generateOneCommunity(), 
            card3: generateOneCommunity()}
}

const generateTurn = () => {
    return {card4: generateOneCommunity()}
}

const generateRiver = () => {
    return {card5: generateOneCommunity()}
}

const generateOneCommunity = () => {
    // generate 1 card for turn/river
    const random = Math.floor(Math.random() * cardsInPlay.length)
    cardsInPlay.splice(random, 1)
    community += [deck[random]]
    return deck[random]
}

const Winner = () => {
    // determine winner given users and community cards
    if (community.length < 5) {

    } else {
        var winner = activePlayers[0]
        var bestHand = getBestHand([winner])
    }
}

const getBestHand = (cards) => {
    // Of a list of 7 cards in 'CARDS', return the best hand possible. Assumes cards == length 7.

}

const compareHands = (hand1, hand2) => {
    // return 0 if hand1 is better, and 1 if hand2 is better.
}

const hasPair = (cards, notRank = -1) => {
    // returns the [rank, index1, index2] of the pair if it exists in CARDS, 0 otherwise.
    // the pair cannot be of the rank "NOTRANK"; used for hasTwoPair
    var ranks = []
    var indices = []

    for (i = 0; i < cards.length; i++) {
        var rank = cards[i].rank
        if (ranks.includes(rank) && rank !== notRank) {
            return [rank, ranks.indexOf(rank), i]
        } else {
            ranks.push(rank)
            indices.push(i)
        }
    }
    return 0
}

const hasTwoPair = (cards) => {
    // returns [rank1, rank2, index1, index2, index3, index4] if there is a two pair in CARDS, 0 otherwise.
    // ** have to fix to find the BEST two pair
    var pair1 = hasPair(cards)
    if (pair1 === 0) {
        return 0
    } else {
        var pair2 = hasPair(cards, pair1[0])
        if (pair2 === 0) {
            return 0
        }
        else {
            return [pair1[0], pair2[0], pair1[1], pair1[2], pair2[1], pair2[2]]
        }
    }
}

const hasThreeOfAKind = (cards) => {
    // returns [rank, index1, index2, index3] if there is a three of a kind in CARDS, 0 otherwise.
    // Assumes there is no full house in the hand.
    //     (if there were, hasFullHouse would find it first)
    var pair1 = hasPair(cards)
    if (pair1 === 0) {
        return 0
    } else {
        for (i = pair1[2] + 1; i < cards.length; i++) {
            if (cards[i].rank === pair1[0]) {
                pair1.push(i)
                return pair1
            }
        }
        return 0
    }
}

const hasStraight = (cards) => {
    // returns the highest rank of the straight if it exists, 0 otherwise.
    // ex: cards = [ace, two, three, four, five, ten, king], hasStraight(cards) = 5
    // ex: cards = [ace, two, ten, jack, queen, king], hasStraight(cards) = 14
    var ranks = []
    cards.forEach(card => {ranks.push(card.rank)})
    if (ranks.includes(1)) {
        ranks.push(14) // ace is also the largest
    }
    ranks.sort(function(a, b){return a-b})
    var count = 1
    var max = ranks[ranks.length - 1]
    for (i = ranks.length - 1; i > -1; i--) {
        if (count == 5) {
            return max
        } else if (ranks[i] - 1 === ranks[i-1]) {
            count++
        } else {
            count = 1
            max = ranks[i]
        }
    }
    return 0

}

const checkTypeWin = () => {
    // check type of win
}

const getPot = () => {
    // get value of pot
    return pot
}

const addToPot = (chips) => {
    // add chips to pot
    pot += chips
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

// console.log(generateHand()) // 2 random cards

oneD = {rank : 1, suit : 'diamond'}
twoH = {rank : 2, suit : 'heart'}
twoD = {rank : 2, suit : 'diamond'}
twoC = {rank : 2, suit : 'clubs'}
threeH = {rank : 3, suit : 'heart'}
threeD = {rank : 3, suit : 'diamond'}
fourH = {rank : 4, suit : 'heart'}
fiveH = {rank : 5, suit : 'heart'}
sixC = {rank : 6, suit : 'club'}
sevenC = {rank : 7, suit : 'club'}
tenD = {rank : 10, suit : 'diamond'}
elevenD = {rank : 11, suit : 'diamond'}
twelveD = {rank : 12, suit : 'diamond'}
thirteenD = {rank : 13, suit : 'diamond'}

// console.log(hasPair([twoD, twoH, threeH])) // [2, 0, 1]
// console.log(hasPair([twoD, threeH]))       // 0

// console.log(hasTwoPair([twoD, twoH, threeD, threeH, fourH, fiveH])) // [2, 3, 0, 1, 2, 3]
// console.log(hasTwoPair([twoD, threeD, fourH, twoH, fiveH, threeH])) // [2, 3, 0, 3, 1, 5]
// console.log(hasTwoPair([twoD, threeD, fourH, fiveH]))               // 0

// console.log(hasThreeOfAKind([twoD, twoH, twoC, threeD, fourH, fiveH]))   // [2, 0, 1, 2]
// console.log(hasThreeOfAKind([twoD, threeD, twoH, fourH, fiveH, twoC]))   // [2, 0, 2, 5]
// console.log(hasThreeOfAKind([twoD, twoH, threeD, threeH, fourH, fiveH])) // 0

console.log(hasStraight([twoD, threeD, fourH, fiveH])) // 0
console.log(hasStraight([twoD, threeD, fourH, fiveH, sixC])) // 6
console.log(hasStraight([twoD, threeD, fourH, fiveH, sixC, sevenC])) // 7
console.log(hasStraight([oneD, tenD, elevenD, twelveD, sixC, thirteenD])) // 14

//module.exports = { getStartingPlayers, getNextPlayer }