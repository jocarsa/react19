import React, { useState } from "react";
import "./Calculator.css";
import Pantalla from "./Pantalla";
import CalcButton from "./CalcButton";

const Calculator = () => {
  const [expression, setExpression] = useState("");

  const handleButtonClick = (value) => {
    if (value === "=") {
      try {
        // Replace "X" with "*" for proper multiplication
        const validExp = expression.replace(/X/g, "*");
        const evalResult = eval(validExp); // Note: using eval() comes with potential risks.
        setExpression(evalResult.toString());
      } catch (error) {
        setExpression("Error");
      }
    } else {
      setExpression(expression + value);
    }
  };

  // Define button labels as in the original HTML.
  const buttons = [
    "E", "C", "B", "/",
    "7", "8", "9", "X",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "+/-", "0", ".", "="
  ];

  return (
    <div id="calculadora">
      <Pantalla value={expression} />
      <div id="botones">
        {buttons.map((btn, index) => (
          <CalcButton 
            key={index} 
            value={btn} 
            onClick={() => handleButtonClick(btn)} 
          />
        ))}
      </div>
    </div>
  );
};

export default Calculator;
