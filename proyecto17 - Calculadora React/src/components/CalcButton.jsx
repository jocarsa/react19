import React from "react";
import "./CalcButton.css";

const CalcButton = ({ value, onClick }) => {
  // Apply the "resultado" class if the value is "=".
  const buttonClass = value === "=" ? "resultado" : "";
  
  return (
    <button className={buttonClass} onClick={onClick}>
      {value}
    </button>
  );
};

export default CalcButton;
