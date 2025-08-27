import React from 'react';
import './Select.css';
import triangle from "../assets/Triangle.svg"

const Select = ({ value, onChange, options }) => {

  return (
    <div className="time-selector-container">
      <select 
        className="time-selector"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} >{option.label}</option>
        ))}
      </select>
      <div className="dropdown-arrow">
        <img src = {triangle} alt = "drop-down"/>
      </div>
    </div>
  );
};

export default Select;