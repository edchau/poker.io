import React from 'react'

import './Community.css'

import twoC from '../../icons/cards/2C.png'
import twoD from '../../icons/cards/2D.png'

const style = {height: '70px', width: '50px'}
const invis = {height: '0px', width: '0px'}

const Community = ({ flop, turn, river, deck1, deck2, deck3, deck4, deck5 }) => (
    <div className="community">
        <img className="flop" 
            src={flop[0] != null && deck1 != null ? deck1[flop[0].rank-1] : twoC} 
            alt="card" 
            style={flop.length > 0 ? style : invis} />
        <img className="flop" 
            src={flop[1] != null && deck2 != null ? deck2[flop[1].rank-1] : twoC} 
            alt="card"
            style={flop.length > 0 ? style : invis} />
        <img className="flop" 
            src={flop[2] != null && deck3 != null ? deck3[flop[2].rank-1] : twoC} 
            alt="card" 
            style={flop.length > 0 ? style : invis} />
        <img className="turn"
            src={turn[0] != null && deck4 != null ? deck4[turn[0].rank-1] : twoC} 
            alt="card" 
            style={turn.length > 0 ? style : invis} />
        <img className="riv" 
            src={river[0] != null && deck5 != null ? deck5[river[0].rank-1] : twoC}
            alt="card" 
            style={river.length > 0 ? style : invis} />
    </div>
)

export default Community