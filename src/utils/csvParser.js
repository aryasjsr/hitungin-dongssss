function normalizeNumber(value) {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).trim().replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function splitCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;

  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
    } else if ((char === ',' || char === ';' || char === '\t') && !quoted) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
}

export function parseCsvInput(text) {
  if (!text || typeof text !== 'string') {
    return { mode: null, rawValues: [], xiRows: [], invalidRows: [], headers: [] };
  }

  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const invalidRows = [];
  const parsedRows = [];
  let headers = [];
  let numericColumnCount = null;

  lines.forEach((line, index) => {
    const cells = splitCsvLine(line);
    const numericCells = cells.map(normalizeNumber);
    const validNumbers = numericCells.filter(value => value !== null);

    if (index === 0 && validNumbers.length === 0) {
      headers = cells;
      return;
    }

    if (validNumbers.length === 0) {
      invalidRows.push({ row: index + 1, value: line, reason: 'Tidak ada angka valid.' });
      return;
    }

    const rowNumbers = numericCells
      .map((value, column) => ({ value, column }))
      .filter(item => item.value !== null);

    const currentCount = Math.min(rowNumbers.length, 2);
    numericColumnCount = numericColumnCount ?? currentCount;

    if (numericColumnCount === 1) {
      parsedRows.push({ x: rowNumbers[0].value });
      return;
    }

    const xi = rowNumbers[0]?.value;
    const fi = rowNumbers[1]?.value;
    if (xi === undefined || fi === undefined || !Number.isInteger(fi) || fi < 1) {
      invalidRows.push({ row: index + 1, value: line, reason: 'Format xi/fi tidak valid.' });
      return;
    }
    parsedRows.push({ xi, fi });
  });

  if (numericColumnCount === 2) {
    return { mode: 'frequency', rawValues: [], xiRows: parsedRows, invalidRows, headers };
  }

  return {
    mode: 'raw',
    rawValues: parsedRows.map(row => row.x),
    xiRows: [],
    invalidRows,
    headers,
  };
}
