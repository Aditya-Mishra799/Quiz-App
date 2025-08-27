import React from "react";
import "./Input.css";

const Input = ({ value, onChange, placeholder = "Enter text", ...props }) => {
  return (
    <input
      type="text"
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Input;
