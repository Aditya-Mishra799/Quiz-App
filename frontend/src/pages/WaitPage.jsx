import React from 'react'
import Badge from "../components/Badge"
import Loader from '../components/Loader'
import styles from "./WaitPage.module.css"

const WaitPage = () => {
  return (
    <div className={styles.page}>
      <Badge />
     <Loader/>
     <h2>Wait for the teacher to ask questions..</h2>
    </div>
  )
}

export default WaitPage
