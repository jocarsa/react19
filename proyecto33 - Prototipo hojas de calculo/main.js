/***********************************************
 * GLOBAL STATE
 ***********************************************/
let currentUser = null;         // user object from server
let currentDocumentId = null;   // ID of the doc being edited
let docContent = null;          // entire doc JSON (with multiple sheets)
let currentSheetIndex = 0;      // which sheet is active
let currentCell = null;         // which cell is in focus

document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("login-screen");
  const dashboardScreen = document.getElementById("dashboard-screen");
  const editorScreen = document.getElementById("editor-screen");

  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");
  const createDocButton = document.getElementById("create-doc-button");
  const backToDashboardBtn = document.getElementById("back-to-dashboard");
  const addSheetBtn = document.getElementById("add-sheet");

  // LOGIN
  loginButton.addEventListener("click", async () => {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const res = await fetch("back.php?action=login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success) {
      currentUser = data.user;
      showDashboard();
    } else {
      document.getElementById("login-error").textContent = data.message || "Login failed.";
    }
  });

  // LOGOUT
  logoutButton.addEventListener("click", async () => {
    const res = await fetch("back.php?action=logout");
    const data = await res.json();
    if (data.success) {
      currentUser = null;
      showLogin();
    }
  });

  // CREATE DOCUMENT
  createDocButton.addEventListener("click", async () => {
    const newDocName = document.getElementById("new-doc-name").value.trim();
    if (!newDocName) return;
    const res = await fetch("back.php?action=createDoc", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ docName: newDocName })
    });
    const data = await res.json();
    if (data.success) {
      loadDocumentList();
      document.getElementById("new-doc-name").value = "";
    } else {
      alert(data.message);
    }
  });

  // BACK TO DASHBOARD
  backToDashboardBtn.addEventListener("click", () => {
    editorScreen.classList.add("hidden");
    dashboardScreen.classList.remove("hidden");
    currentDocumentId = null;
    docContent = null;
  });

  // ADD NEW SHEET
  addSheetBtn.addEventListener("click", () => {
    if (!docContent) return;
    const newIndex = docContent.sheets.length;
    const newSheetName = "Sheet " + (newIndex + 1);
    const newSheetData = {
      name: newSheetName,
      colCount: 3,
      rowCount: 2,
      cells: [
        [ { text: "", formula: "" }, { text: "", formula: "" }, { text: "", formula: "" } ],
        [ { text: "", formula: "" }, { text: "", formula: "" }, { text: "", formula: "" } ]
      ]
    };
    docContent.sheets.push(newSheetData);
    rebuildEditor(); // re-create tabs and tables
    switchSheet(newIndex); // jump to new sheet
    autoSaveDocument();
  });

  // Attempt session auto-login
  checkSession().then(loggedIn => {
    if (loggedIn) {
      showDashboard();
    } else {
      showLogin();
    }
  });
});

/***********************************************
 * SESSION CHECK
 ***********************************************/
async function checkSession() {
  const res = await fetch("back.php?action=getSessionUser");
  const data = await res.json();
  if (data.loggedIn) {
    currentUser = data.user;
    return true;
  }
  return false;
}

/***********************************************
 * SHOW SCREENS
 ***********************************************/
function showLogin() {
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("dashboard-screen").classList.add("hidden");
  document.getElementById("editor-screen").classList.add("hidden");
}
function showDashboard() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("dashboard-screen").classList.remove("hidden");
  document.getElementById("editor-screen").classList.add("hidden");

  // Display user info
  const userInfoDiv = document.getElementById("user-info");
  userInfoDiv.textContent = `Welcome, ${currentUser.full_name} (${currentUser.email})`;

  // Load doc list
  loadDocumentList();
}
function showEditor() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("dashboard-screen").classList.add("hidden");
  document.getElementById("editor-screen").classList.remove("hidden");
}

/***********************************************
 * LOAD DOCUMENT LIST
 ***********************************************/
async function loadDocumentList() {
  const docList = document.getElementById("document-list");
  docList.innerHTML = "Loading...";
  const res = await fetch("back.php?action=getDocs");
  const data = await res.json();
  if (!data.success) {
    docList.innerHTML = "<li>Error loading docs.</li>";
    return;
  }
  const docs = data.documents;
  docList.innerHTML = "";
  docs.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.doc_name;
    const openBtn = document.createElement("button");
    openBtn.textContent = "Open";
    openBtn.addEventListener("click", () => {
      openDocument(doc.id);
    });
    li.appendChild(openBtn);
    docList.appendChild(li);
  });
}

/***********************************************
 * OPEN DOCUMENT
 ***********************************************/
async function openDocument(docId) {
  const res = await fetch(`back.php?action=loadDoc&docId=${docId}`);
  const data = await res.json();
  if (!data.success) {
    alert("Error loading document.");
    return;
  }
  currentDocumentId = docId;
  docContent = data.document.doc_content; // { sheets: [...] }
  if (!docContent || !docContent.sheets) {
    // If doc is empty or old, initialize
    docContent = {
      sheets: [
        {
          name: "Sheet 1",
          colCount: 3,
          rowCount: 2,
          cells: [
            [ { text: "", formula: "" }, { text: "", formula: "" }, { text: "", formula: "" } ],
            [ { text: "", formula: "" }, { text: "", formula: "" }, { text: "", formula: "" } ]
          ]
        }
      ]
    };
  }

  document.getElementById("current-doc-name").textContent = "Editing: " + data.document.doc_name;
  currentSheetIndex = 0;

  showEditor();
  rebuildEditor();
}

/***********************************************
 * REBUILD EDITOR (SHEET TABS + SHEET TABLES)
 ***********************************************/
function rebuildEditor() {
  const sheetTabsContainer = document.getElementById("sheet-tabs");
  const sheetsContainer = document.getElementById("sheets-container");
  sheetTabsContainer.innerHTML = "";
  sheetsContainer.innerHTML = "";

  docContent.sheets.forEach((sheetData, index) => {
    // Create tab button
    const tabBtn = document.createElement("div");
    tabBtn.classList.add("sheet-tab");
    tabBtn.textContent = sheetData.name;
    if (index === currentSheetIndex) {
      tabBtn.classList.add("active");
    }
    tabBtn.addEventListener("click", () => {
      switchSheet(index);
    });
    sheetTabsContainer.appendChild(tabBtn);

    // Create sheet <div>
    const sheetDiv = document.createElement("div");
    sheetDiv.classList.add("sheet");
    if (index === currentSheetIndex) {
      sheetDiv.classList.add("active");
    }
    sheetDiv.dataset.sheetIndex = index;

    // Create table
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Blank corner
    const cornerTh = document.createElement("th");
    headerRow.appendChild(cornerTh);

    // Build column headers
    for (let c = 0; c < sheetData.colCount; c++) {
      const th = document.createElement("th");
      th.textContent = getColumnLabel(c);
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Build tbody
    const tbody = document.createElement("tbody");
    for (let r = 0; r < sheetData.rowCount; r++) {
      const rowTr = document.createElement("tr");
      // Row header
      const rowHeader = document.createElement("th");
      rowHeader.textContent = (r + 1);
      rowTr.appendChild(rowHeader);

      for (let c = 0; c < sheetData.colCount; c++) {
        const cellData = sheetData.cells[r][c];
        const td = document.createElement("td");
        td.contentEditable = "true";
        td.dataset.formula = cellData.formula || "";
        td.textContent = cellData.text || "";
        rowTr.appendChild(td);
      }
      tbody.appendChild(rowTr);
    }
    table.appendChild(tbody);
    sheetDiv.appendChild(table);

    sheetsContainer.appendChild(sheetDiv);

    // Bind focus/blur for this sheet's table
    bindSheetTableEvents(table, index);
  });
}

/***********************************************
 * SWITCH SHEET
 ***********************************************/
function switchSheet(index) {
  currentSheetIndex = index;
  const tabButtons = document.querySelectorAll(".sheet-tab");
  tabButtons.forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
  const sheetDivs = document.querySelectorAll(".sheet");
  sheetDivs.forEach((sheetDiv, i) => {
    sheetDiv.classList.toggle("active", i === index);
  });
  // Reset currentCell
  currentCell = null;
  document.getElementById("formula-bar").value = "";
  document.getElementById("cell-label").textContent = "A1";
}

/***********************************************
 * BIND SHEET TABLE EVENTS (FOCUS/BLUR)
 ***********************************************/
function bindSheetTableEvents(table, sheetIndex) {
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  // Focus In
  tbody.addEventListener("focusin", (e) => {
    if (e.target.tagName.toLowerCase() === "td") {
      currentCell = e.target;
      const { row, col } = getCellPosition(currentCell);
      document.getElementById("cell-label").textContent =
        getColumnLabel(col) + (row + 1);

      // If formula
      if (currentCell.dataset.formula && currentCell.dataset.formula.startsWith("=")) {
        document.getElementById("formula-bar").value = currentCell.dataset.formula;
        currentCell.textContent = currentCell.dataset.formula;
      } else {
        document.getElementById("formula-bar").value = currentCell.textContent;
      }

      highlightHeadings(thead, tbody, row, col);
    }
  }, true);

  // Focus Out
  tbody.addEventListener("focusout", (e) => {
    if (e.target.tagName.toLowerCase() === "td") {
      const text = e.target.textContent.trim();
      if (text.startsWith("=")) {
        e.target.dataset.formula = text;
        const val = evaluateFormula(table, text);
        e.target.textContent = val;
      } else {
        e.target.dataset.formula = "";
      }
      // Save to docContent
      updateDocContent(sheetIndex, table);
      autoSaveDocument();
    }
  }, true);
}

/***********************************************
 * FORMULA BAR
 ***********************************************/
document.getElementById("formula-bar").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (!currentCell) return;
    const newVal = e.target.value.trim();
    currentCell.focus();
    document.execCommand("selectAll", false, null);

    if (newVal.startsWith("=")) {
      currentCell.dataset.formula = newVal;
      const table = currentCell.closest("table");
      const val = evaluateFormula(table, newVal);
      currentCell.textContent = val;
    } else {
      currentCell.textContent = newVal;
      currentCell.dataset.formula = "";
    }
    // Save
    const sheetDiv = currentCell.closest(".sheet");
    if (sheetDiv) {
      const sheetIndex = parseInt(sheetDiv.dataset.sheetIndex, 10);
      updateDocContent(sheetIndex, table);
      autoSaveDocument();
    }
  }
});

/***********************************************
 * ROW/COLUMN ADDING
 * (We store the "Add Row"/"Add Col" at the doc level, so let's do them
 * for the currently active sheet)
 ***********************************************/
document.getElementById("editor-screen").addEventListener("click", (e) => {
  if (e.target.id === "add-row") {
    addRowToActiveSheet();
  } else if (e.target.id === "add-col") {
    addColToActiveSheet();
  }
});

function addRowToActiveSheet() {
  if (!docContent) return;
  const sheetData = docContent.sheets[currentSheetIndex];
  const newRowIdx = sheetData.rowCount;
  sheetData.rowCount++;
  const newRow = [];
  for (let c = 0; c < sheetData.colCount; c++) {
    newRow.push({ text: "", formula: "" });
  }
  sheetData.cells.push(newRow);
  rebuildEditor();
  switchSheet(currentSheetIndex);
  autoSaveDocument();
}
function addColToActiveSheet() {
  if (!docContent) return;
  const sheetData = docContent.sheets[currentSheetIndex];
  const newColIdx = sheetData.colCount;
  sheetData.colCount++;
  // Add a cell to each row
  for (let r = 0; r < sheetData.rowCount; r++) {
    sheetData.cells[r].push({ text: "", formula: "" });
  }
  rebuildEditor();
  switchSheet(currentSheetIndex);
  autoSaveDocument();
}

/***********************************************
 * DOC CONTENT SYNCHRONIZATION
 ***********************************************/
function updateDocContent(sheetIndex, table) {
  // Rebuild docContent.sheets[sheetIndex] from the table
  const sheetData = docContent.sheets[sheetIndex];
  const tbody = table.querySelector("tbody");
  const rows = tbody.querySelectorAll("tr");

  for (let r = 0; r < rows.length; r++) {
    const cells = rows[r].querySelectorAll("td");
    for (let c = 0; c < cells.length; c++) {
      sheetData.cells[r][c].text = cells[c].textContent;
      sheetData.cells[r][c].formula = cells[c].dataset.formula || "";
    }
  }
}

/***********************************************
 * AUTO-SAVE DOCUMENT
 ***********************************************/
async function autoSaveDocument() {
  if (!currentDocumentId || !docContent) return;
  const saveStatus = document.getElementById("save-status");
  saveStatus.textContent = "Saving...";

  const res = await fetch("back.php?action=saveDoc", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      docId: currentDocumentId,
      docContent
    })
  });
  const data = await res.json();
  if (data.success) {
    saveStatus.textContent = "All changes saved.";
  } else {
    saveStatus.textContent = "Error saving document.";
  }
}

/***********************************************
 * FORMULA EVALUATION
 ***********************************************/
function evaluateFormula(table, formula) {
  let expr = formula.substring(1);
  expr = expr.replace(/[A-Za-z]+[0-9]+/g, (match) => {
    return getCellValueByRef(table, match);
  });

  let result;
  try {
    result = eval(expr);
    if (typeof result !== "number" || isNaN(result)) {
      return "#ERROR";
    }
  } catch (e) {
    return "#ERROR";
  }
  return result;
}

function getCellValueByRef(table, ref) {
  const { row, col } = parseCellRef(ref);
  const rows = table.querySelectorAll("tbody tr");
  if (row < 0 || row >= rows.length) return 0;
  const cells = rows[row].querySelectorAll("td");
  if (col < 0 || col >= cells.length) return 0;
  const val = parseFloat(cells[col].textContent);
  return isNaN(val) ? 0 : val;
}

function parseCellRef(ref) {
  const match = ref.match(/([A-Za-z]+)([0-9]+)/);
  if (!match) return { row: -1, col: -1 };
  const colLetters = match[1].toUpperCase();
  const rowNumber = parseInt(match[2], 10);

  let colIndex = 0;
  for (let i = 0; i < colLetters.length; i++) {
    colIndex = colIndex * 26 + (colLetters.charCodeAt(i) - 64);
  }
  colIndex -= 1;

  const rowIndex = rowNumber - 1;
  return { row: rowIndex, col: colIndex };
}

/***********************************************
 * HIGHLIGHT HEADERS
 ***********************************************/
function highlightHeadings(thead, tbody, rowIndex, colIndex) {
  // Clear old highlights
  thead.querySelectorAll("th").forEach(th => th.classList.remove("highlight"));
  tbody.querySelectorAll("th").forEach(th => th.classList.remove("highlight"));

  // Thead colIndex+1 (since 0 is corner)
  const headerRow = thead.querySelector("tr");
  const colHeader = headerRow.children[colIndex + 1];
  if (colHeader) {
    colHeader.classList.add("highlight");
  }

  // Tbody rowIndex
  const allRows = tbody.querySelectorAll("tr");
  if (allRows[rowIndex]) {
    const rowHeader = allRows[rowIndex].querySelector("th");
    if (rowHeader) {
      rowHeader.classList.add("highlight");
    }
  }
}

/***********************************************
 * HELPER: getColumnLabel
 ***********************************************/
function getColumnLabel(colIndex) {
  let label = "";
  while (colIndex >= 0) {
    label = String.fromCharCode((colIndex % 26) + 65) + label;
    colIndex = Math.floor(colIndex / 26) - 1;
  }
  return label;
}

function getCellPosition(td) {
  const tr = td.parentElement;
  const rowIndex = [...tr.parentElement.children].indexOf(tr);
  const colIndex = td.cellIndex - 1; // skip row header
  return { row: rowIndex, col: colIndex };
}
