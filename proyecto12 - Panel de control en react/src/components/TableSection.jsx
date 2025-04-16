// src/components/TableSection.jsx
import React from 'react';
import { useStore } from 'effector-react';
import { $tableData, $activeMenu } from '../stores';
import './TableSection.css'; // optional separate css

const TableSection = () => {
  const tableData = useStore($tableData);
  const activeMenu = useStore($activeMenu);

  if (tableData.length === 0) {
    return (
      <section>
        <h3>Seleccione un elemento en el menú</h3>
      </section>
    );
  }

  // Grab the keys from the first item in the array
  const keys = Object.keys(tableData[0] || {});

  return (
    <section>
      <h3>{activeMenu}</h3>
      <table>
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key}>{key}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, idx) => (
            <tr key={idx}>
              {keys.map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
              <td>
                <a href="#!" className="actualizar">✏</a>
                <a href="#!" className="eliminar">❌</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default TableSection;
