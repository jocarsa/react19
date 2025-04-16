import React, { useState } from 'react';
import './App.css';

// Componente reutilizable para grupos de botones de opción (radio buttons)
function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div className="control-group">
      <p>{label}</p>
      {options.map((option) => (
        <label key={option.value}>
          <input 
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

// Componente reutilizable para campos de entrada (número y texto)
function InputField({ label, type, name, value, onChange, min }) {
  return (
    <div className="control-group">
      <label htmlFor={name}>{label}</label>
      <input 
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
      />
    </div>
  );
}

// Componente para las propiedades del contenedor de grid
function ContainerControls({ containerProps, setContainerProps }) {
  const handleChange = (prop, newValue) => {
    setContainerProps((prev) => ({ ...prev, [prop]: newValue }));
  };

  return (
    <fieldset>
      <legend>Propiedades del contenedor (Grid)</legend>
      <InputField
        label="grid-template-columns:" 
        name="gridTemplateColumns"
        type="text"
        value={containerProps.gridTemplateColumns}
        onChange={(val) => handleChange('gridTemplateColumns', val)}
      />
      <InputField
        label="grid-template-rows:" 
        name="gridTemplateRows"
        type="text"
        value={containerProps.gridTemplateRows}
        onChange={(val) => handleChange('gridTemplateRows', val)}
      />
      <RadioGroup 
        label="grid-auto-flow:" 
        name="gridAutoFlow"
        options={[
          { value: 'row', label: 'row' },
          { value: 'column', label: 'column' },
          { value: 'dense', label: 'dense' },
        ]}
        value={containerProps.gridAutoFlow}
        onChange={(val) => handleChange('gridAutoFlow', val)}
      />
      <RadioGroup 
        label="justify-items:" 
        name="justifyItems"
        options={[
          { value: 'start', label: 'start' },
          { value: 'end', label: 'end' },
          { value: 'center', label: 'center' },
          { value: 'stretch', label: 'stretch' },
        ]}
        value={containerProps.justifyItems}
        onChange={(val) => handleChange('justifyItems', val)}
      />
      <RadioGroup 
        label="align-items:" 
        name="alignItems"
        options={[
          { value: 'start', label: 'start' },
          { value: 'end', label: 'end' },
          { value: 'center', label: 'center' },
          { value: 'stretch', label: 'stretch' },
        ]}
        value={containerProps.alignItems}
        onChange={(val) => handleChange('alignItems', val)}
      />
      <RadioGroup 
        label="justify-content:" 
        name="justifyContent"
        options={[
          { value: 'start', label: 'start' },
          { value: 'end', label: 'end' },
          { value: 'center', label: 'center' },
          { value: 'space-between', label: 'space-between' },
          { value: 'space-around', label: 'space-around' },
        ]}
        value={containerProps.justifyContent}
        onChange={(val) => handleChange('justifyContent', val)}
      />
      <RadioGroup 
        label="align-content:" 
        name="alignContent"
        options={[
          { value: 'start', label: 'start' },
          { value: 'end', label: 'end' },
          { value: 'center', label: 'center' },
          { value: 'space-between', label: 'space-between' },
          { value: 'space-around', label: 'space-around' },
        ]}
        value={containerProps.alignContent}
        onChange={(val) => handleChange('alignContent', val)}
      />
    </fieldset>
  );
}

// Componente para las propiedades de los items de grid
function ItemControls({ itemProps, setItemProps }) {
  const handleChange = (prop, newValue) => {
    setItemProps((prev) => ({ ...prev, [prop]: newValue }));
  };

  return (
    <fieldset>
      <legend>Propiedades de los items</legend>
      <InputField 
        label="grid-column:" 
        name="gridColumn"
        type="text"
        value={itemProps.gridColumn}
        onChange={(val) => handleChange('gridColumn', val)}
      />
      <InputField 
        label="grid-row:" 
        name="gridRow"
        type="text"
        value={itemProps.gridRow}
        onChange={(val) => handleChange('gridRow', val)}
      />
      <RadioGroup 
        label="justify-self:" 
        name="justifySelf"
        options={[
          { value: 'auto', label: 'auto' },
          { value: 'start', label: 'start' },
          { value: 'end', label: 'end' },
          { value: 'center', label: 'center' },
          { value: 'stretch', label: 'stretch' },
        ]}
        value={itemProps.justifySelf}
        onChange={(val) => handleChange('justifySelf', val)}
      />
      <RadioGroup 
        label="align-self:" 
        name="alignSelf"
        options={[
          { value: 'auto', label: 'auto' },
          { value: 'start', label: 'start' },
          { value: 'end', label: 'end' },
          { value: 'center', label: 'center' },
          { value: 'stretch', label: 'stretch' },
        ]}
        value={itemProps.alignSelf}
        onChange={(val) => handleChange('alignSelf', val)}
      />
      <div className="control-group">
        <p>
          <strong>Grid-area:</strong> {itemProps.gridColumn} / {itemProps.gridRow}
        </p>
      </div>
    </fieldset>
  );
}

function App() {
  // Estados para las propiedades del contenedor, de los items y para la cantidad de items
  const [containerProps, setContainerProps] = useState({
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'auto',
    gridAutoFlow: 'row',
    justifyItems: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'start',
    alignContent: 'start',
  });
  
  const [itemProps, setItemProps] = useState({
    gridColumn: 'auto',
    gridRow: 'auto',
    justifySelf: 'auto',
    alignSelf: 'auto',
  });
  
  const [numItems, setNumItems] = useState(3);
  
  // Estilo dinámico para el contenedor de grid
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: containerProps.gridTemplateColumns,
    gridTemplateRows: containerProps.gridTemplateRows,
    gridAutoFlow: containerProps.gridAutoFlow,
    justifyItems: containerProps.justifyItems,
    alignItems: containerProps.alignItems,
    justifyContent: containerProps.justifyContent,
    alignContent: containerProps.alignContent,
    gap: '10px',
  };

  // Genera el código CSS con los parámetros definidos
  const generateCSSCode = () => {
    return `/* Contenedor */
#container {
  display: grid;
  grid-template-columns: ${containerProps.gridTemplateColumns};
  grid-template-rows: ${containerProps.gridTemplateRows};
  grid-auto-flow: ${containerProps.gridAutoFlow};
  justify-items: ${containerProps.justifyItems};
  align-items: ${containerProps.alignItems};
  justify-content: ${containerProps.justifyContent};
  align-content: ${containerProps.alignContent};
}

/* Items */
.item {
  grid-column: ${itemProps.gridColumn};
  grid-row: ${itemProps.gridRow};
  justify-self: ${itemProps.justifySelf};
  align-self: ${itemProps.alignSelf};
}`;
  };

  // Renderiza los items de ejemplo
  const renderItems = () => {
    const items = [];
    for (let i = 1; i <= numItems; i++) {
      items.push(
        <div key={i} className="item">
          Item {i}
        </div>
      );
    }
    return items;
  };

  return (
    <div className="app">
      <header>
        <h1>jocarsa | grid</h1>
      </header>
      <section id="controls">
        {/* Control de cantidad de items */}
        <fieldset>
          <legend>Número de items</legend>
          <div className="control-group">
            <label htmlFor="numItems">Cantidad de items:</label>
            <input 
              type="number" 
              id="numItems" 
              value={numItems} 
              min="1"
              onChange={(e) => setNumItems(parseInt(e.target.value, 10))}
            />
          </div>
        </fieldset>
        <ContainerControls containerProps={containerProps} setContainerProps={setContainerProps} />
        <ItemControls itemProps={itemProps} setItemProps={setItemProps} />
      </section>
      <section id="sample">
        <h2 style={{ textAlign: 'center' }}>Contenedor de muestra</h2>
        <div id="container" style={containerStyle}>
          {renderItems()}
        </div>
        <h2 style={{ textAlign: 'center' }}>Código CSS generado</h2>
        <pre id="cssCode">{generateCSSCode()}</pre>
      </section>
    </div>
  );
}

export default App;
