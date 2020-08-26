const users = require('./users')

var deck = [] // {rank, suit} -- DO NOT REMOVE ITEMS FROM THIS
var cardsInPlay = Array.from(Array(52).keys()) // list of indices of deck
const suits = ["spade", "diamond", "club", "heart"]
const ranks = [1,2,3,4,5,6,7,8,9,10,11,12,13]

// populate deck
for (s in suits) {
    for (r in ranks) {
        deck.push({rank : parseInt(r)+1, 
                   suit : suits[s]})
    }
}

var activePlayers = [] // { id, username, room }
var playerHands = [] // {id, hand}
var ind = 0
var community = []
var pot = 0
var roundCount = 0


const restart = () => {
    roundCount = 0
    pot = 0
    ind = 0
    community = 0
    playerHands = []
    activePlayers = []
    cardsInPlay = Array.from(Array(52).keys())

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

const sortHand = (cards) => {
    // sorts hand by rank of cards. breaks ties arbitrarily
    cards.sort(function(a, b){
                if (a.rank == 1 || b.rank == 1) {
                    return b.rank - a.rank
                }
                return a.rank - b.rank
               })
    return cards
}

/* The "has" methods below return the best hand of that category if it exists; otherwise, returns 0 
   They each assume that the hands better than them are not possible. */

const hasHighCard = (cards, cardsNeeded = 5) => {
    // returns the largest cards in the hand, in descending order
    // returns 5 items if cards.length > 5, or cards.length items if cards.length <= 5
    cards = sortHand(cards)
    if (cards.length > cardsNeeded) {
        hand = []
        for (i = cards.length - 1; i >= cards.length - cardsNeeded; i--) {
            hand.push(cards[i])
        }
        return hand
    } else {
        return cards
    }
}

const hasPairs = (cards) => {
    // returns the best hand with pairs (if they exists) in CARDS, 0 otherwise.
    // ex: will return 2 pairs and a high card if possible
    //     if not, will return 1 pair and 3 high cards if possible
    //     if not, returns 0
    // assumes there are no 3-of-a-kinds; hasThreeOfAKind should be called before this
    // assumes cards.length >= 5
    var hand = []
    var singletons = []
    var cards = sortHand(cards)
    // reverse order to grab the best pairs first
    for (i = cards.length - 2; i >= 0; i--) {
        // add pairs
        if (cards[i].rank == cards[i+1].rank) {
            hand.push(cards[i])
            hand.push(cards[i+1])
            i--
            if (hand.length == 4) {
                // we found top two pairs, so we can break out, and treat the rest of the cards as singles
                for (j = i; j >= 0; j--) {
                    singletons.push(cards[j])
                }
                break
            }
        // keep track of values that don't make it to the top two pairs
        } else {
            singletons.push(cards[i+1])
        }
    }
    // no pairs were found
    if (hand.length == 0) { return 0 }
    // fill out the hands with high cards
    var j = 0
    while (hand.length < 5) {
        // singleton is ordered high to low
        hand.push(singletons[j])
        j++
    }
    return hand
}

const hasThreeOfAKind = (cards) => {
    // returns [triplet1, triplet2, triplet3, highcard1, highcard2] if there is a three of a kind in CARDS, 0 otherwise.
    // Assumes there is no full house in the hand.
    //     (if there were, hasFullHouse would find it first)
    var hand = []
    var singletons = []
    var cards = sortHand(cards)
    for (i = cards.length - 3; i >= 0; i--) {
        // add the set if it exists
        if (cards[i].rank == cards[i+1].rank 
         && cards[i+1].rank == cards[i+2].rank) {
            hand.push(cards[i])
            hand.push(cards[i+1])
            hand.push(cards[i+2])
            // we found a set, so we can break out, and treat the rest of the cards as singles
            for (j = i-1; j >= 0; j--) {
                singletons.push(cards[j])
            }
            break
        } else {
            singletons.push(cards[i+2])
        }
    }
    // no sets were found
    if (hand.length == 0) { return 0 }
    // fill out the hands with high cards
    var j = 0
    while (hand.length < 5) {
        // singleton is ordered high to low
        hand.push(singletons[j])
        j++
    }
    return hand
}

const hasStraight = (cards) => {
    // returns the highest rank of the straight if it exists, 0 otherwise.
    // ex: cards = [ace, two, three, four, five, ten, king], hasStraight(cards) = 5
    // ex: cards = [ace, two, ten, jack, queen, king], hasStraight(cards) = 14
    cards = sortHand(cards)
    // var ranks = []
    // cards.forEach(card => {ranks.push(card.rank)})
    // if (ranks.includes(1)) {
    //     ranks.push(14) // ace is also the largest
    // }
    // ranks.sort(function(a, b){return a-b})
    var count = 1
    var max = cards[cards.length - 1]
    for (i = cards.length - 1; i > 0; i--) {
        if (cards[i].rank - 1 === cards[i-1].rank 
         || cards[i].rank === 1 && cards[i-1].rank === 13) {
            count++
        } else {
            count = 1
            max = cards[i].rank
        }
        if (count == 5) {
            return max
        }
    }
    return 0
}

const hasFlush = (cards) => {
    // returns the largest flush possible, if it exists, 0 otherwise
    // if there are more than 5 cards of the same suit, takes the largest 5
    cards = sortHand(cards)
    for (s in suits) {
        var currSuit = suits[s]
        var flushHand = []
        // look at cards largest to smallest.
        for (i = cards.length - 1; i >= 0; i--) {
            // add cards to the flushHand if it is of currSuit
            if (cards[i].suit == currSuit) {
                flushHand.push(cards[i])
                // return the hand once we have 5 cards
                if (flushHand.length == 5) {
                    return flushHand
                }
            }
        }
        if (flushHand.length >= 3) { // if only 3 or 4 of one suit, other suits cannot make flushes
            return 0
        }
    }
    return 0
}

const hasFullHouse = (cards) => {
    // returns [ThreeOfAKind rank, pair rank] if the full house exists, otherwise 0
    // assumes no four of a kinds, as hasForOfAKind should handle that.
    var hand = []
    var remainder = []
    var cards = sortHand(cards)
    for (i = cards.length - 3; i >= 0; i--) {
        // add the set if it exists
        if (cards[i].rank == cards[i+1].rank 
         && cards[i+1].rank == cards[i+2].rank) {
            hand.push(cards[i])
            hand.push(cards[i+1])
            hand.push(cards[i+2])
            // we found a set, so we can break out, and collect the remaining cards
            for (j = i-1; j >= 0; j--) {
                remainder.push(cards[j])
            }
            break
        } else {
            remainder.push(cards[i+2])
        }
    }
    // no sets were found
    if (hand.length == 0) { return 0 }
    // find the best pair from the remainder
    // reverse order to grab the best pairs first
    for (i = 0; i < remainder.length-1; i++) {
        if (remainder[i].rank == remainder[i+1].rank) {
            hand.push(remainder[i])
            hand.push(remainder[i+1])
            break
        }
    }
    if (hand.length < 5) { return 0 }
    return hand
}

const hasFourOfAKind = (cards) => {
    // returns [FourOfAKind rank, highcard 1]
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

const getRoundCount = () => {
    return roundCount
}

const getNextPlayer = () => {
    if(ind >= activePlayers.length) {
        console.log('end round')
        ind = 0
        roundCount += 1
        if(roundCount == 5) {
            console.log('restart')
            restart()
        } else {
            return null
        }
    }
    active = activePlayers[ind]
    ind += 1
    return active
}

module.exports = { generateHand, getStartingPlayers, getNextPlayer, 
                    getRoundCount, generateFlop, generateTurn, 
                    generateRiver }