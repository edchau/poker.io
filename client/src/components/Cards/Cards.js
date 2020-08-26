import React from 'react'

import './Cards.css'

const Cards = ({ chips, hand, deck1, deck2 }) => (
    <div className="mainPlayer">
        <h1>Your chips: {chips}</h1>
        <h1>Your cards:</h1>

        {hand.map((card, i) => 
            <div key={i}>
                <img className="card1" 
                    src={hand[0] != null && deck1 != null ? deck1[hand[0].card1.rank-1] : null} 
                    alt="card" />
                <img className="card2" 
                    src={hand[0] != null && deck1 != null ? deck2[hand[0].card2.rank-1] : null} 
                    alt="card" />
            </div>
        )}
    </div>
)

export default Cards