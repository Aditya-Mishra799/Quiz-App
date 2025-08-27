import React from 'react'
import "./Button.css"
const Button = ({children, ...props}) => {
  return (
    <button {...props} className = "btn">
      {children}
    </button>
  )
}

export default Button
