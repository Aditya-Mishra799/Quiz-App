import React from 'react'
import "./OutlineButton.css"
const OutlineButton = ({children, ...props}) => {
  return (
    <button {...props} className = "outline-btn">
      {children}
    </button>
  )
}


export default OutlineButton
