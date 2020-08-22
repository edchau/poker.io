import React from 'react'

import './Actions.css'

const checkStyle = {height: '50px', width: '100px'}
const callStyle = {height: '50px', width: '100px'}
const raiseStyle = {height: '50px', width: '100px'}
const foldStyle = {height: '50px', width: '100px'}
const invis = {height: '0px', width: '0px'}

const Actions = ({ start, call, play }) => (
    <div className="mainPlayer">
        <button onClick={start} style={play.length > 0 ? checkStyle : invis}>check</button>
        <button onClick={call} style={play.length > 0 ? callStyle : invis}>call</button>
        <button style={play.length > 0 ? raiseStyle : invis}>raise</button>
        <button style={play.length > 0 ? foldStyle : invis}>fold</button>
    </div>
)

export default Actions