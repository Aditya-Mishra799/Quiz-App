import React from 'react'
import styles from "./ButtonLight.module.css"
const ButtonLight = ({children, ...props}) => {
  return (
    <button {...props} className = {styles["btn"]}>
      {children}
    </button>
  )
}

export default ButtonLight
