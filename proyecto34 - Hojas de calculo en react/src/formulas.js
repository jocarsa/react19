// src/formulas.js

/**
 * Evaluate custom formulas (such as SUM and AVERAGE).
 *
 * @param {string} expr - The formula expression with no leading '='.
 * @param {Array} cells - The current sheet’s cells array.
 * @param {function} getCellValue - A helper to get a single cell’s numeric value, given a cell reference (e.g., "A1").
 * @param {function} getRangeValues - A helper to get all numeric values from a range (e.g., "A1:B3").
 * @returns {number|undefined} - The evaluated result if the expression matches a custom formula; otherwise undefined.
 */
export function evaluateCustomFormula(expr, cells, getCellValue, getRangeValues) {
  // Check for SUM function. Example: SUM(A1,A2,A3) or SUM(A1:B3)
  const sumMatch = expr.match(/^SUM\(([^)]+)\)$/i);
  if (sumMatch) {
    const args = sumMatch[1].split(',').map(s => s.trim());
    let values = [];
    args.forEach(arg => {
      if (arg.includes(':')) {
        const [start, end] = arg.split(':').map(s => s.trim());
        values.push(...getRangeValues(cells, start, end));
      } else {
        values.push(getCellValue(cells, arg));
      }
    });
    return values.reduce((acc, cur) => acc + cur, 0);
  }

  // Check for AVERAGE function. Example: AVERAGE(A1,A2,A3) or AVERAGE(A1:B3)
  const avgMatch = expr.match(/^AVERAGE\(([^)]+)\)$/i);
  if (avgMatch) {
    const args = avgMatch[1].split(',').map(s => s.trim());
    let values = [];
    args.forEach(arg => {
      if (arg.includes(':')) {
        const [start, end] = arg.split(':').map(s => s.trim());
        values.push(...getRangeValues(cells, start, end));
      } else {
        values.push(getCellValue(cells, arg));
      }
    });
    return values.length > 0 ? values.reduce((acc, cur) => acc + cur, 0) / values.length : 0;
  }

  // No custom formula matched – return undefined.
}
