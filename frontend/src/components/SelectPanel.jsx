import React from 'react'
import "./SelectPanel.css"
import { useNavigate } from "react-router-dom";

const SelectPanel = ({label, description, link, ...props}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(link);
  };
  return (
    <div className='panel' onClick={handleClick}>
      <h3>{label}</h3>
      <p>{description}</p>
    </div>
  )
}

export default SelectPanel
