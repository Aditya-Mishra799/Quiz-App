import React from 'react';
import './YesNoToggle.css';

const YesNoToggle= ({ value, onChange }) => {
  return (
    <div className="yesno-toggle">
      <label className="toggle-option">
        <input
          type="radio"
          name={`toggle-${Math.random()}`}
          checked={value === true}
          onChange={() => onChange(true)}
        />
        <span className="radio-custom"></span>
        Yes
      </label>
      <label className="toggle-option">
        <input
          type="radio"
          name={`toggle-${Math.random()}`}
          checked={value === false}
          onChange={() => onChange(false)}
        />
        <span className="radio-custom"></span>
        No
      </label>
    </div>
  );
};

export default YesNoToggle;