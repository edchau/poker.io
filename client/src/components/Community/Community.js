import React from 'react'

import './Community.css'

import twoC from '../../icons/cards/2C.png'
import twoD from '../../icons/cards/2D.png'

const style = {height: '70px', width: '50px'}
const invis = {height: '0px', width: '0px'}

const Community = ({ river, turn, flop }) => (
    <div className="community">
        <img className="riv" src={twoC} alt="card" style={river.length > 0 ? style : invis} />
        <img className="riv" src={twoD} alt="card" style={river.length > 0 ? style : invis} />
        <img className="riv" src={twoD} alt="card" style={river.length > 0 ? style : invis} />
        <img className="turn" src={twoD} alt="card" style={turn.length > 0 ? style : invis} />
        <img className="flop" src={twoD} alt="card" style={flop.length > 0 ? style : invis} />
    </div>
)

export default Community