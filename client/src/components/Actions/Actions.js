import React from 'react'

import './Actions.css'

const Actions = ({ generateNewHand }) => (
    <div className="mainPlayer">
        <button>Check</button>
        <button onClick={generateNewHand}>Call</button>
        <button>Raise</button>
        <button>Fold</button>
    </div>
)

export default Actions