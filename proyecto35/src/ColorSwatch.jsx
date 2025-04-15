import React, { useState } from "react";

export default function ColorSwatch({ color }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="swatch-wrapper">
      <div
        className="swatch"
        style={{ backgroundColor: color }}
        title={color}
      ></div>
      <div className="swatch-info">
        <span>{color}</span>
        <button className="copy-btn" onClick={copyToClipboard}>
          Copy
        </button>
        {copied && <span className="copied-msg">✓</span>}
      </div>
    </div>
  );
}
