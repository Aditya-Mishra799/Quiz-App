import React from 'react'
import Badge from "../components/Badge"
import ChatFAB from '../components/ChatFAB'
import Loader from '../components/Loader'
import styles from "./WaitPage.module.css"

const WaitPage = () => {
  return (
    <div className={styles.page}>
      <Badge />
     <Loader/>
     <h2>Wait for the teacher to ask questions..</h2>
     <ChatFAB />
    </div>
  )
}

export default WaitPage
