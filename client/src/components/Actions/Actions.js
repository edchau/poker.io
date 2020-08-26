import React from 'react'

import './Actions.css'

const style = {height: '50px', width: '100px', display:'inline-block'}
const invis = {height: '0px', width: '0px', display:'none'}

const Actions = ({ round, start, check, call, raise, fold, play }) => (
    <div className="mainPlayer">
        <button onClick={round} style={start.length > 0 ? invis : style}>start</button>
        <button onClick={check} style={play.length > 0 ? style : invis}>check</button>
        <button onClick={call} style={play.length > 0 ? style : invis}>call</button>
        <button onClick={raise} style={play.length > 0 ? style : invis}>raise</button>
        <button onClick={fold} style={play.length > 0 ? style : invis}>fold</button>
    </div>
)

export default Actions