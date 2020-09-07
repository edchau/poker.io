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
    community = []
    playerHands = []
    cardsInPlay = Array.from(Array(52).keys())
}

const fold = (id) => {
    // remove player from activePlayers
    // remove the hand from playerHands
    const playerIndex = activePlayers.findIndex((player) => player.id === id)
    if (playerIndex !== -1) {
        activePlayers.splice(playerIndex, 1)
    }
    const handIndex = activePlayers.findIndex((hand) => hand.id === id)
    if (handIndex !== -1) {
        playerHands.splice(handIndex, 1)
    }

}

const generateHand = (id) => {
    // generates new hand (two cards) for player id
    const random1 = Math.floor(Math.random() * cardsInPlay.length)
    var card1 = deck[cardsInPlay[random1]]
    const random2 = Math.floor(Math.random() * cardsInPlay.length)
    var card2 = deck[cardsInPlay[random2]]
    playerHands.push({id : id, hand : [card1, card2]})
    cardsInPlay.splice(random1, 1)
    cardsInPlay.splice(random2, 1)
    return {card1: card1, card2: card2}
}

const generateFlop = () => {
    // generate 3 cards for the flop
    return {card1: generateOneCommunity(), 
            card2: generateOneCommunity(), 
            card3: generateOneCommunity()}
}

const generateTurn = () => {
    // generate 1 card for the turn
    return {card4: generateOneCommunity()}
}

const generateRiver = () => {
    // generate 1 card for the river
    return {card5: generateOneCommunity()}
}

const generateOneCommunity = () => {
    // generate 1 card from deck for the community cards
    const random = Math.floor(Math.random() * cardsInPlay.length)
    community.concat([deck[cardsInPlay[random]]])
    cardsInPlay.splice(random, 1)
    return deck[random]
}

const Winner = () => {
    // determine winner given users and community cards
    // assume the hand has went to showdown (multiple players, 5 community cards, bets in)
    var winner = playerHands[0]
    var winnerHand = getBestHand(winner.hand.concat(community))
    var ties = []
    for (var i = 1; i < playerHands.length; i++) {
        var player = playerHands[i]
        var playerHand = getBestHand(player.hand.concat(community))

        var comparison = compareHands(winnerHand, playerHand)
        if (comparison == 1) {
            winner = player
            winnerHand = playerHand
        } else if (comparison == -1) {
            if (!ties.includes(winner.id)) {
                ties.push(winner.id)
            }
            ties.push(player.id)
        } // else, the winner is still the winner
    }
    if (ties.length > 0) {
        return ties
    }
    return winner
    
}

const getBestHand = (cards) => {
    // Of a list of 7 cards in 'CARDS', return the best hand possible. Assumes cards == length 7.
    // x = hasStraightFlush(cards)
    // if (x) { return x }
    x = hasFourOfAKind(cards)
    if (x) { return x }
    x = hasFullHouse(cards)
    if (x) { return x }
    x = hasFlush(cards)
    if (x) { return x }
    // x = hasStraight(cards)
    // if (x) { return x }
    x = hasThreeOfAKind(cards)
    if (x) { return x }
    x = hasPairs(cards)
    if (x) { return x }

    return hasHighCard(cards)

}

const compareHands = (hand1, hand2) => {
    // Return 0 if hand1 is better, and 1 if hand2 is better.
    // Return -1 if they are the same.
    // Assumes they are both actually 5 card hands (lists of 5, objects with cards attributes)
    // with the name of the hand at the end of the hand
    var chn = compareHandNames(hand1[5], hand2[5])
    if (chn > -1) { return chn }
    var handName = hand1[5]
    if (handName == 'High Card' || handName == 'Straight') {
        return forwardCompareRanks(hand1, hand2)
    } else if (handName == '1 Pair' || handName == '2 Pair'
            || handName == 'Three of a kind' || handName == '') {
        return backwardCompareRanks(hand1, hand2)
    }
}

const forwardCompareRanks = (hand1, hand2) => {
    // Goes from first card to last, comparing the hands.
    // Returns the same values as compareHands
    // Assumes same input as compareHands
    for (i = 0; i < 5; i++) {
        if (hand1[i] > hand2[i]) {
            return 0
        } else if (hand1[i] < hand2[i]) {
            return 1
        }
    }
    return -1
}

const backwardCompareRanks = (hand1, hand2) => {
    // Goes from last card to first, comparing the hands.
    // Returns the same values as compareHands
    // Assumes same input as compareHands
    for (i = 4; i >= 0; i--) {
        if (hand1[i] > hand2[i]) {
            return 0
        } else if (hand1[i] < hand2[i]) {
            return 1
        }
    }
    return -1
}


/* The "has" methods below return the best hand of that category if it exists; otherwise, returns 0 
   They each assume that the hands better than them are not possible. */

   const compareHandNames = (name1, name2) => {
    // Returns 0 if name1 is a better hand than name2
    // Returns 1 if name1 is a worse hand than name2
    // Returns -1 if they are the same
    if (name1 == name2) { return -1 }

    if (name1 == 'High Card') { return 1 } 

    else if (name1 == '1 Pair') {
        if (name2 == 'High Card') { return 0 } 
        else {
            return 1 }
    } 
    else if (name1 == '2 Pair') {
        if (name2 == '1 Pair' || name2 == 'High Card') { return 0 } 
        else { return 1 }
    } 
    else if (name1 == 'Three of a kind') {
        if (name2 == '2 Pair' || name2 == '1 Pair' || name2 == 'High Card') {
            return 0 } 
        else { return 1 }
    }
    else if (name1 == 'Straight') {
        if (name2 == '2 Pair' || name2 == '1 Pair' 
         || name2 == 'High Card' || name2 == 'Three of a kind') {
            return 0 } 
        else { return 1 }
    }
    else if (name1 == 'Flush') {
        if (name2 == '2 Pair' || name2 == '1 Pair' || name2 == 'High Card'
        || name2 == 'Three of a kind' || name2 == 'Straight') {
            return 0 } 
        else { return 1 }
    }
    else if (name1 == 'Full House') {
        if (name2 == '2 Pair' || name2 == '1 Pair' || name2 == 'High Card'
        || name2 == 'Three of a kind' || name2 == 'Straight' || name2 == 'Flush') {
            return 0 } 
        else { return 1 }
    }
    else if (name1 == 'Full House') {
        if (name2 == 'Four of a kind' || name2 == 'Straight Flush') {
            return 1 } 
        else { return 0 }
    }
    else if (name1 == 'Four of a kind') {
        if (name2 == 'Straight Flush') {
            return 1 } 
        else { return 0 }
    } else {
        return 0
    }
}

const sortHand = (cards) => {
    // sorts hand low to high by rank of cards. breaks ties arbitrarily
    cards.sort(function(a, b){
                if (a.rank == 1 || b.rank == 1) {
                    return b.rank - a.rank
                }
                return a.rank - b.rank
               })
    return cards
}

/* The "has" methods below return the best hand of that category if it exists; otherwise, returns 0 
   They each assume that the hands better than them are not possible. 
   All functions also assume the input is of length 5 or greater. */

   const hasHighCard = (cards) => {
    // returns the largest cards in the hand, lowest to highest.
    // returns 5 items if cards.length > 5, or cards.length items if cards.length == 5
    cards = sortHand(cards)
    if (cards.length > 5) {
        hand = []
        for (i = cards.length - 1; i >= cards.length - 5; i--) {
            hand.unshift(cards[i]) // ensure low to high
        }
        hand.push("High Card")
        return hand
    } else {
        cards.push("High Card")
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
    var numPairs = hand.length / 2
    var j = 0
    while (hand.length < 5) {
        // singleton is ordered high to low
        hand.push(singletons[j])
        j++
    }
    hand.push(numPairs + " Pair")
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
    hand.push("Three of a kind")
    return hand
}

const hasStraight = (cards) => { // UNFINISHED NEEDS FIXING
    // returns the cards of the best possible straight if it exists, 0 otherwise
    // ex: cards = [ace, two, three, four, five, ten, king], hasStraight(cards) = [ace, two, three, four, five]
    // ex: cards = [ace, two, ten, jack, queen, king], hasStraight(cards) = [ten, jack]
    cards = sortHand(cards)
    var set = [cards[0]]
    for (i = 1; i < cards.length; i++) {
        if (set[set.length-1].rank == cards[i].rank - 1) {
            set.push(cards[i])
        }
    }
    for (i = set.length-1; i >= 4; i--) {
        if ([set.length - 1].rank == 1  
                && (set[i-1].rank == 5 || set[i-1].rank == 13)
                && set[i-1].rank - 1 == set[i-2].rank
                && set[i-2].rank - 1 == set[i-3].rank
                && set[i-3].rank - 1 == set[i-4].rank) {
                    set.unshift("Straight")
                    return set.slice(i-4)
        } else if (set[i].rank - 1 == set[i-1].rank
                && set[i-1].rank - 1 == set[i-2].rank
                && set[i-2].rank - 1 == set[i-3].rank
                && set[i-3].rank - 1 == set[i-4].rank) {
                    set.unshift("Straight")
                    return set.slice(i-4)
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
                    flushHand.push("Flush")
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
    // returns [triplet1, triplet2, triplet3, pair1, pair2] if the full house exists, otherwise 0
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
    hand.push("Full House")
    return hand
}

const hasFourOfAKind = (cards) => {
    // returns [quadruplet1, quadruplet2, quadruplet3, quadruplet4, highcard1]
    var hand = []
    var remainder = []
    var cards = sortHand(cards)
    for (i = cards.length - 4; i >= 0; i--) {
        // add the set if it exists
        if (cards[i].rank == cards[i+1].rank 
         && cards[i+1].rank == cards[i+2].rank
         && cards[i+2].rank == cards[i+3].rank) {
            hand.push(cards[i])
            hand.push(cards[i+1])
            hand.push(cards[i+2])
            hand.push(cards[i+3])
            // we found quads, so we can break out, and collect 1 more card for our high card
            remainder.push(cards[i-1])
            break
        } else {
            remainder.push(cards[i+3])
        }
    }
    // no sets were found
    if (hand.length == 0) { return 0 }
    // add the high card
    hand.push(remainder[0])
    hand.push("Four of a kind")
    return hand
}

const hasStraightFlush = (cards) => {
    var flushCards = hasFlush(cards)
    if (flushCards == 0) {
        return 0
    // 1, 2, 3, 4, 5 || 1, 13, 12, 11, 10
    } else {
        var sf = hasStraight(flushCards.slice(0,5))
        if (sf != 0) {
            sf = sf.slice(0,5)
            sf.push("Straight Flush")
        }
        return sf
    }
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
                    generateRiver, Winner }