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

// Componente para los controles del contenedor de Flexbox
function ContainerControls({ containerProps, setContainerProps }) {
  const handleChange = (prop, newValue) => {
    setContainerProps((prev) => ({ ...prev, [prop]: newValue }));
  };

  return (
    <fieldset>
      <legend>Propiedades del contenedor</legend>
      <RadioGroup 
        label="flex-direction:" 
        name="flexDirection"
        options={[
          { value: 'row', label: 'row' },
          { value: 'row-reverse', label: 'row-reverse' },
          { value: 'column', label: 'column' },
          { value: 'column-reverse', label: 'column-reverse' },
        ]}
        value={containerProps.flexDirection}
        onChange={(val) => handleChange('flexDirection', val)}
      />
      <RadioGroup 
        label="flex-wrap:" 
        name="flexWrap"
        options={[
          { value: 'nowrap', label: 'nowrap' },
          { value: 'wrap', label: 'wrap' },
          { value: 'wrap-reverse', label: 'wrap-reverse' },
        ]}
        value={containerProps.flexWrap}
        onChange={(val) => handleChange('flexWrap', val)}
      />
      <RadioGroup 
        label="justify-content:" 
        name="justifyContent"
        options={[
          { value: 'flex-start', label: 'flex-start' },
          { value: 'flex-end', label: 'flex-end' },
          { value: 'center', label: 'center' },
          { value: 'space-between', label: 'space-between' },
          { value: 'space-around', label: 'space-around' },
          { value: 'space-evenly', label: 'space-evenly' },
        ]}
        value={containerProps.justifyContent}
        onChange={(val) => handleChange('justifyContent', val)}
      />
      <RadioGroup 
        label="align-items:" 
        name="alignItems"
        options={[
          { value: 'stretch', label: 'stretch' },
          { value: 'flex-start', label: 'flex-start' },
          { value: 'flex-end', label: 'flex-end' },
          { value: 'center', label: 'center' },
          { value: 'baseline', label: 'baseline' },
        ]}
        value={containerProps.alignItems}
        onChange={(val) => handleChange('alignItems', val)}
      />
      <RadioGroup 
        label="align-content:" 
        name="alignContent"
        options={[
          { value: 'stretch', label: 'stretch' },
          { value: 'flex-start', label: 'flex-start' },
          { value: 'flex-end', label: 'flex-end' },
          { value: 'center', label: 'center' },
          { value: 'space-between', label: 'space-between' },
          { value: 'space-around', label: 'space-around' },
          { value: 'space-evenly', label: 'space-evenly' },
        ]}
        value={containerProps.alignContent}
        onChange={(val) => handleChange('alignContent', val)}
      />
      <div className="control-group">
        <p>
          <strong>flex-flow:</strong> {containerProps.flexDirection} {containerProps.flexWrap}
        </p>
      </div>
    </fieldset>
  );
}

// Componente para los controles de las propiedades de los items
function ItemControls({ itemProps, setItemProps }) {
  const handleChange = (prop, newValue) => {
    setItemProps((prev) => ({ ...prev, [prop]: newValue }));
  };

  return (
    <fieldset>
      <legend>Propiedades de los items</legend>
      <InputField 
        label="order:" 
        name="order"
        type="number"
        value={itemProps.order}
        onChange={(val) => handleChange('order', val)}
      />
      <InputField 
        label="flex-grow:" 
        name="flexGrow"
        type="number"
        value={itemProps.flexGrow}
        onChange={(val) => handleChange('flexGrow', val)}
      />
      <InputField 
        label="flex-shrink:" 
        name="flexShrink"
        type="number"
        value={itemProps.flexShrink}
        onChange={(val) => handleChange('flexShrink', val)}
      />
      <InputField 
        label="flex-basis:" 
        name="flexBasis"
        type="text"
        value={itemProps.flexBasis}
        onChange={(val) => handleChange('flexBasis', val)}
      />
      <RadioGroup 
        label="align-self:" 
        name="alignSelf"
        options={[
          { value: 'auto', label: 'auto' },
          { value: 'flex-start', label: 'flex-start' },
          { value: 'flex-end', label: 'flex-end' },
          { value: 'center', label: 'center' },
          { value: 'baseline', label: 'baseline' },
          { value: 'stretch', label: 'stretch' },
        ]}
        value={itemProps.alignSelf}
        onChange={(val) => handleChange('alignSelf', val)}
      />
      <div className="control-group">
        <p>
          <strong>flex:</strong> {itemProps.flexGrow} {itemProps.flexShrink} {itemProps.flexBasis}
        </p>
      </div>
    </fieldset>
  );
}

function App() {
  // Estados para las propiedades del contenedor, los items y la cantidad de items
  const [containerProps, setContainerProps] = useState({
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
  });
  
  const [itemProps, setItemProps] = useState({
    order: 0,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    alignSelf: 'auto',
  });
  
  const [numItems, setNumItems] = useState(3);
  
  // Estilo dinámico para el contenedor
  const containerStyle = {
    display: 'flex',
    flexDirection: containerProps.flexDirection,
    flexWrap: containerProps.flexWrap,
    justifyContent: containerProps.justifyContent,
    alignItems: containerProps.alignItems,
    alignContent: containerProps.alignContent,
    gap: '10px',
  };

  // Genera el código CSS resultante
  const generateCSSCode = () => {
    return `/* Contenedor */
#container {
  display: flex;
  flex-direction: ${containerProps.flexDirection};
  flex-wrap: ${containerProps.flexWrap};
  justify-content: ${containerProps.justifyContent};
  align-items: ${containerProps.alignItems};
  align-content: ${containerProps.alignContent};
  /* flex-flow: ${containerProps.flexDirection} ${containerProps.flexWrap}; */
}

/* Items */
.item {
  order: ${itemProps.order};
  flex-grow: ${itemProps.flexGrow};
  flex-shrink: ${itemProps.flexShrink};
  flex-basis: ${itemProps.flexBasis};
  align-self: ${itemProps.alignSelf};
  /* flex: ${itemProps.flexGrow} ${itemProps.flexShrink} ${itemProps.flexBasis}; */
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
        <h1>jocarsa | flexbox</h1>
      </header>
      
      <section id="controls">
        {/* Control para la cantidad de items */}
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
        
        <ContainerControls 
          containerProps={containerProps} 
          setContainerProps={setContainerProps} 
        />
        
        <ItemControls 
          itemProps={itemProps} 
          setItemProps={setItemProps} 
        />
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
