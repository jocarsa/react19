import React, { useState } from "react";
import './App.css'; // Ensure this is included!

const GradientGenerator = () => {
  const [color1, setColor1] = useState("#ff7e5f");
  const [color2, setColor2] = useState("#feb47b");
  const [direction, setDirection] = useState("to right");
  const [gradientType, setGradientType] = useState("linear");
  const [copied, setCopied] = useState(false);
  const [presets] = useState([
    ["#ff7e5f", "#feb47b"],
    ["#4facfe", "#00f2fe"],
    ["#43e97b", "#38f9d7"],
    ["#667eea", "#764ba2"],
    ["#ff6a00", "#ee0979"]
  ]);

  const gradient =
    gradientType === "linear"
      ? `linear-gradient(${direction}, ${color1}, ${color2})`
      : `radial-gradient(circle, ${color1}, ${color2})`;

  const cssCode = `background: ${gradient};`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">🎨 Gradient Generator</h1>

      <div className="grid gap-4 md:grid-cols-4 mb-8 bg-white p-4 rounded-2xl shadow">
        <div className="flex flex-col items-center">
          <label className="mb-2 font-semibold">Color 1</label>
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-16 h-16 rounded" />
        </div>

        <div className="flex flex-col items-center">
          <label className="mb-2 font-semibold">Gradient Type</label>
          <select value={gradientType} onChange={(e) => setGradientType(e.target.value)} className="p-2 rounded border">
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>

        <div className="flex flex-col items-center">
          <label className="mb-2 font-semibold">Direction</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="p-2 rounded border"
            disabled={gradientType === "radial"}
          >
            <option value="to right">Left → Right</option>
            <option value="to left">Right → Left</option>
            <option value="to bottom">Top → Bottom</option>
            <option value="to top">Bottom → Top</option>
            <option value="135deg">Diagonal ↘</option>
            <option value="45deg">Diagonal ↗</option>
          </select>
        </div>

        <div className="flex flex-col items-center">
          <label className="mb-2 font-semibold">Color 2</label>
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-16 h-16 rounded" />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Preset Gradients</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          {presets.map(([preset1, preset2], index) => (
            <button
              key={index}
              className="w-20 h-10 rounded shadow border"
              style={{ background: `linear-gradient(to right, ${preset1}, ${preset2})` }}
              onClick={() => {
                setColor1(preset1);
                setColor2(preset2);
              }}
              title={`Preset ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-6 text-white shadow mb-6" style={{ background: gradient }}>
        <h2 className="text-xl font-bold mb-2">Gradient Preview</h2>
        <code className="block p-2 bg-black/30 rounded text-sm">{cssCode}</code>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
  onClick={copyToClipboard}
  className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
>
  📋 Copy CSS
</button>
        {copied && <span className="text-green-600 font-semibold">Copied!</span>}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Sample Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 text-white rounded shadow" style={{ background: gradient }}>Button 1</button>
          <button className="px-4 py-2 text-white rounded shadow" style={{ background: gradient }}>Button 2</button>
          <button className="px-4 py-2 text-white rounded shadow" style={{ background: gradient }}>Button 3</button>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p className="mb-1 font-semibold">CSS Code:</p>
        <code className="block bg-white p-2 rounded border">{cssCode}</code>
      </div>
    </div>
  );
};

export default GradientGenerator;