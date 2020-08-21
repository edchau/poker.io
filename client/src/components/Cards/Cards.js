import React from 'react'

import './Cards.css'

import twoC from '../../icons/cards/2C.png'
import twoD from '../../icons/cards/2D.png'


const Cards = ({ chips, hand }) => (
    <div className="mainPlayer">
        <h1>Your chips: {chips}</h1>
        <h1>Your cards: {hand}</h1>
        <img className="card1" src={twoC} alt="card" />
        <img className="card2" src={twoD} alt="card" />
    </div>
)

export default Cards