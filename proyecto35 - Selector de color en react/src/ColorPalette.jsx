import React, { useEffect, useState } from "react";
import ColorSwatch from "./ColorSwatch";
import { generateColorFamily } from "./colorUtils";

export default function ColorPalette() {
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");
  const [colorFamily, setColorFamily] = useState({});

  // Cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("paletteSession");
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedColor(data.selectedColor);
    }
  }, []);

  // Generar familia de colores y guardar sesión
  useEffect(() => {
  const family = generateColorFamily(selectedColor);

  // Corregimos: siempre reiniciar valores, NO acumular
  setColorFamily({
    base: family.base,
    complement: family.complement,
    triad: [...family.triad],
    analogous: [...family.analogous],
    monochromatic: [...family.monochromatic],
  });

  localStorage.setItem("paletteSession", JSON.stringify({ selectedColor }));
}, [selectedColor]);

  const handleSelect = (color) => {
    setSelectedColor(color);
  };

  const handleReset = () => {
    localStorage.removeItem("paletteSession");
    setSelectedColor("#FF6B6B");
  };

  return (
    <div>
      <div className="picker-row">
        <label htmlFor="colorPicker">Selecciona un color: </label>
        <input
          id="colorPicker"
          type="color"
          value={selectedColor}
          onChange={(e) => handleSelect(e.target.value)}
        />
        <button className="reset-btn" onClick={handleReset}>
          Reiniciar sesión
        </button>
      </div>

      <div className="section">
        <h2>Base</h2>
        <ColorSwatch color={colorFamily.base} />
      </div>

      <div className="section">
        <h2>Complementarios</h2>
        <ColorSwatch color={colorFamily.complement} />
      </div>

      <div className="section">
        <h2>Tríada</h2>
        <div className="swatch-container">
          {colorFamily.triad?.map((c) => (
            <ColorSwatch key={c} color={c} />
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Análogos</h2>
        <div className="swatch-container">
          {colorFamily.analogous?.map((c) => (
            <ColorSwatch key={c} color={c} />
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Monocromáticos</h2>
        <div className="swatch-container">
          {colorFamily.monochromatic?.map((c) => (
            <ColorSwatch key={c} color={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
