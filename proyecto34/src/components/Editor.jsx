import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { evaluateCustomFormula } from '../formulas'; // Make sure the path is correct
import '../styles/Editor.css';

function Editor() {
  const navigate = useNavigate();
  const { docId } = useParams();  // from /editor/:docId

  const [currentUser, setCurrentUser] = useState(null);
  const [docName, setDocName] = useState('');
  const [docContent, setDocContent] = useState(null);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');

  // State for tracking the currently selected cell and its formula bar value.
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [formulaBarValue, setFormulaBarValue] = useState('');

  // Load session and document on mount or when docId changes.
  useEffect(() => {
    checkSessionAndLoadDoc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId]);

  async function checkSessionAndLoadDoc() {
    try {
      const resUser = await fetch('http://localhost/react19/proyecto34/back/back.php?action=getSessionUser', {
        credentials: 'include'
      });
      const dataUser = await resUser.json();
      if (!dataUser.loggedIn) {
        navigate('/');
        return;
      }
      setCurrentUser(dataUser.user);

      // Load document data.
      const resDoc = await fetch(
        `http://localhost/react19/proyecto34/back/back.php?action=loadDoc&docId=${docId}`,
        { credentials: 'include' }
      );
      const dataDoc = await resDoc.json();
      if (dataDoc.success) {
        setDocName(dataDoc.document.doc_name);
        if (!dataDoc.document.doc_content || !dataDoc.document.doc_content.sheets) {
          // Initialize the document content.
          setDocContent({
            sheets: [
              {
                name: "Sheet 1",
                colCount: 3,
                rowCount: 2,
                cells: [
                  [
                    { text: "", formula: "" },
                    { text: "", formula: "" },
                    { text: "", formula: "" }
                  ],
                  [
                    { text: "", formula: "" },
                    { text: "", formula: "" },
                    { text: "", formula: "" }
                  ]
                ]
              }
            ]
          });
        } else {
          setDocContent(dataDoc.document.doc_content);
        }
      } else {
        alert('Error loading document');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert('Error loading document');
      navigate('/dashboard');
    }
  }

  // Auto-save the document.
  const autoSaveDocument = useCallback(async (updatedContent) => {
    if (!docId || !updatedContent) return;
    setSaveMessage('Saving...');
    try {
      const res = await fetch('http://localhost/react19/proyecto34/back/back.php?action=saveDoc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ docId, docContent: updatedContent })
      });
      const data = await res.json();
      setSaveMessage(data.success ? 'All changes saved.' : 'Error saving document.');
    } catch (err) {
      console.error(err);
      setSaveMessage('Error saving document.');
    }
  }, [docId]);

  // Switch active sheet.
  function switchSheet(index) {
    setCurrentSheetIndex(index);
    // Clear any selected cell when switching sheets.
    setSelectedCell({ row: null, col: null });
    setFormulaBarValue('');
  }

  // Add a new sheet.
  function addSheet() {
    if (!docContent) return;
    const newIndex = docContent.sheets.length;
    const newSheet = {
      name: `Sheet ${newIndex + 1}`,
      colCount: 3,
      rowCount: 2,
      cells: [
        [
          { text: "", formula: "" },
          { text: "", formula: "" },
          { text: "", formula: "" }
        ],
        [
          { text: "", formula: "" },
          { text: "", formula: "" },
          { text: "", formula: "" }
        ]
      ]
    };
    const updatedDoc = { ...docContent, sheets: [...docContent.sheets, newSheet] };
    setDocContent(updatedDoc);
    setCurrentSheetIndex(newIndex);
    autoSaveDocument(updatedDoc);
  }

  // Add a row to the active sheet.
  function addRow() {
    if (!docContent) return;
    const sheetsCopy = [...docContent.sheets];
    const sheet = sheetsCopy[currentSheetIndex];
    sheet.rowCount++;
    const newRow = [];
    for (let c = 0; c < sheet.colCount; c++) {
      newRow.push({ text: "", formula: "" });
    }
    sheet.cells.push(newRow);
    const updatedDoc = { ...docContent, sheets: sheetsCopy };
    setDocContent(updatedDoc);
    autoSaveDocument(updatedDoc);
  }

  // Add a column to the active sheet.
  function addCol() {
    if (!docContent) return;
    const sheetsCopy = [...docContent.sheets];
    const sheet = sheetsCopy[currentSheetIndex];
    sheet.colCount++;
    // Add a new cell for each row.
    for (let r = 0; r < sheet.rowCount; r++) {
      sheet.cells[r].push({ text: "", formula: "" });
    }
    const updatedDoc = { ...docContent, sheets: sheetsCopy };
    setDocContent(updatedDoc);
    autoSaveDocument(updatedDoc);
  }

  // ---- Formula Evaluation and Helper Functions ----

  // Parse a cell reference (e.g., "B2") into row and column indexes.
  function parseCellRef(ref) {
    const match = ref.match(/([A-Za-z]+)([0-9]+)/);
    if (!match) return { row: -1, col: -1 };
    let colLetters = match[1].toUpperCase();
    let rowNumber = parseInt(match[2], 10);
    let colIndex = 0;
    for (let i = 0; i < colLetters.length; i++) {
      colIndex = colIndex * 26 + (colLetters.charCodeAt(i) - 64);
    }
    return { row: rowNumber - 1, col: colIndex - 1 };
  }

  // Return numeric value for a cell reference (e.g., "A1").
  function getCellValue(cells, ref) {
    const { row, col } = parseCellRef(ref);
    if (row < 0 || row >= cells.length) return 0;
    if (col < 0 || col >= cells[row].length) return 0;
    const cell = cells[row][col];
    const val = parseFloat(cell.text);
    return isNaN(val) ? 0 : val;
  }

  // Return an array of numeric values for a range (e.g., "A1:B3").
  function getRangeValues(cells, start, end) {
    const startRef = parseCellRef(start);
    const endRef = parseCellRef(end);
    let values = [];
    const rowStart = Math.min(startRef.row, endRef.row);
    const rowEnd = Math.max(startRef.row, endRef.row);
    const colStart = Math.min(startRef.col, endRef.col);
    const colEnd = Math.max(startRef.col, endRef.col);
    for (let r = rowStart; r <= rowEnd; r++) {
      for (let c = colStart; c <= colEnd; c++) {
        if (r < cells.length && c < cells[r].length) {
          const cell = cells[r][c];
          const val = parseFloat(cell.text);
          values.push(isNaN(val) ? 0 : val);
        }
      }
    }
    return values;
  }

  // Evaluate a formula string for the given cells.
  function evaluateFormula(cells, formula) {
    if (!formula || formula[0] !== '=') return formula;
    const expr = formula.substring(1).trim();

    // First, try to evaluate using custom formulas from the formulas.js module.
    const customResult = evaluateCustomFormula(expr, cells, getCellValue, getRangeValues);
    if (customResult !== undefined) {
      return customResult.toString();
    }

    // Otherwise, for basic arithmetic, replace cell references with their numeric values.
    const replacedExpr = expr.replace(/([A-Za-z]+[0-9]+)/g, (match) => {
      return getCellValue(cells, match).toString();
    });
    try {
      const result = eval(replacedExpr);
      return (typeof result === 'number' && !isNaN(result)) ? result.toString() : "#ERROR";
    } catch (e) {
      return "#ERROR";
    }
  }
  // ---- End Formula Evaluation ----

  // ---- Cell Update Handlers ----

  // When updating a cell (from either the table or formula bar),
  // store the original formula (if any) and update the computed value.
  function updateCell(row, col, newValue) {
    const sheetsCopy = [...docContent.sheets];
    const sheet = sheetsCopy[currentSheetIndex];

    if (newValue.startsWith('=')) {
      // Remember the formula.
      sheet.cells[row][col].formula = newValue;
      // Compute and store the evaluated result.
      sheet.cells[row][col].text = evaluateFormula(sheet.cells, newValue);
    } else {
      sheet.cells[row][col].formula = "";
      sheet.cells[row][col].text = newValue;
    }
    const updatedDoc = { ...docContent, sheets: sheetsCopy };
    setDocContent(updatedDoc);
    autoSaveDocument(updatedDoc);
  }

  // When a cell gains focus, load its formula (if available) into the formula bar.
  function handleCellFocus(row, col, cell) {
    setSelectedCell({ row, col });
    setFormulaBarValue(cell.formula ? cell.formula : cell.text);
  }

  // When a cell loses focus (after editing), update its value.
  function handleCellBlur(row, col, text) {
    updateCell(row, col, text.trim());
  }

  // When the formula bar receives an Enter key press, update the selected cell.
  function handleFormulaBarKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedCell.row !== null && selectedCell.col !== null) {
        updateCell(selectedCell.row, selectedCell.col, formulaBarValue.trim());
      }
    }
  }

  // Helper: convert a zero-based column index to a letter label (e.g., 0 → A, 1 → B).
  function columnLabel(colIndex) {
    let label = '';
    let n = colIndex;
    while (n >= 0) {
      label = String.fromCharCode((n % 26) + 65) + label;
      n = Math.floor(n / 26) - 1;
    }
    return label;
  }

  // Return to Dashboard.
  function goBack() {
    navigate('/dashboard');
  }

  if (!docContent) {
    return <div className="editor-container">Loading...</div>;
  }

  const currentSheet = docContent.sheets[currentSheetIndex];

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button onClick={goBack}>Back to Dashboard</button>
        <h2>Editing: {docName}</h2>
      </div>

      {/* Sheet Tabs */}
      <div className="tabs-container">
        <div className="sheet-tabs">
          {docContent.sheets.map((sheet, idx) => (
            <div
              key={idx}
              className={`sheet-tab ${idx === currentSheetIndex ? 'active' : ''}`}
              onClick={() => {
                setSelectedCell({ row: null, col: null });
                setFormulaBarValue('');
                switchSheet(idx);
              }}
            >
              {sheet.name}
            </div>
          ))}
        </div>
        <button className="add-sheet-btn" onClick={addSheet}>+ Add Sheet</button>
      </div>

      {/* Formula Bar */}
      <div className="formula-bar-container">
        <span className="cell-label">
          {selectedCell.row !== null && selectedCell.col !== null 
            ? `${columnLabel(selectedCell.col)}${selectedCell.row + 1}`
            : 'Cell'}
        </span>
        <input
          type="text"
          value={formulaBarValue}
          onChange={(e) => setFormulaBarValue(e.target.value)}
          onKeyDown={handleFormulaBarKeyDown}
          placeholder="Type formula or value"
        />
      </div>

      <div className="actions-bar">
        <button onClick={addRow}>+ Row</button>
        <button onClick={addCol}>+ Column</button>
        <div className="save-status">{saveMessage}</div>
      </div>

      {/* Sheet Table */}
      <div className="sheet-table">
        <table>
          <thead>
            <tr>
              <th></th>
              {Array.from({ length: currentSheet.colCount }).map((_, cIdx) => (
                <th key={cIdx}>{columnLabel(cIdx)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: currentSheet.rowCount }).map((_, rIdx) => (
              <tr key={rIdx}>
                <th>{rIdx + 1}</th>
                {Array.from({ length: currentSheet.colCount }).map((_, cIdx) => {
                  const cell = currentSheet.cells[rIdx][cIdx];
                  return (
                    <td
                      key={cIdx}
                      contentEditable
                      suppressContentEditableWarning
                      onFocus={() => handleCellFocus(rIdx, cIdx, cell)}
                      onBlur={(e) => handleCellBlur(rIdx, cIdx, e.target.textContent)}
                    >
                      {cell.text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Editor;
