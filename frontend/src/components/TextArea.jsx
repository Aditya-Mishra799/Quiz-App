import React from 'react';
import './TextArea.css';

const TextArea = ({ 
  value, 
  onChange, 
  maxLength = 100,
  placeholder = "Enter your question here...",
}) => {
  return (
    <div className="textarea-container">
      <textarea
        className="textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder= {placeholder}
        maxLength={maxLength}
        rows={4}
      />
      <div className="character-counter">
        {value.length}/{maxLength}
      </div>
    </div>
  );
};

export default TextArea;