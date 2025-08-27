import React from 'react'
import logo from "../assets/BadgeIcon.svg"
import "./Badge.css"
const Badge = () => {
  return (
    <div className='badge'>
        <img src={logo} alt="Logo" />
        <span>Intervue Poll</span>
    </div>
  )
}

export default Badge
