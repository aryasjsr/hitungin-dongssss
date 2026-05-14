/**
 * Parse raw text input into numeric values.
 * Handles separators: comma, semicolon, space, newline, tab.
 * Supports negative numbers and decimals.
 *
 * @param {string} text - Raw user input
 * @returns {{ values: number[], invalidTokens: string[] }}
 */
export function parseRawInput(text) {
  if (!text || typeof text !== 'string') {
    return { values: [], invalidTokens: [] };
  }

  // Normalize separators: replace semicolons, tabs, newlines with commas
  const normalized = text
    .replace(/;/g, ',')
    .replace(/\t/g, ',')
    .replace(/\n/g, ',')
    .replace(/\r/g, ',');

  // Split by comma or spaces (but keep negative sign with number)
  const tokens = normalized
    .split(/[,]+/)
    .flatMap(chunk => chunk.trim().split(/\s+/))
    .map(t => t.trim())
    .filter(t => t.length > 0);

  const values = [];
  const invalidTokens = [];

  for (const token of tokens) {
    const parsed = parseToken(token);
    if (parsed !== null) {
      values.push(parsed);
    } else {
      invalidTokens.push(token);
    }
  }

  return { values, invalidTokens };
}

/**
 * Parse a single token into a number.
 * Handles decimal with both . and ,
 * Does NOT support thousands separators or scientific notation.
 *
 * @param {string} token
 * @returns {number|null}
 */
function parseToken(token) {
  if (!token) return null;

  // Remove any trailing/leading whitespace
  let cleaned = token.trim();

  // If the token uses comma as decimal separator (context: single comma in a number like "1,5")
  // We need to handle this carefully since commas are also separators
  // A token reaching this point won't contain separator commas (already split)
  // So any comma here is a decimal separator
  if (cleaned.includes(',')) {
    // Only allow one comma as decimal
    const parts = cleaned.split(',');
    if (parts.length === 2) {
      cleaned = parts[0] + '.' + parts[1];
    } else {
      return null; // Multiple commas = invalid
    }
  }

  // Validate: must match number pattern (optional minus, digits, optional decimal)
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) {
    return null;
  }

  const num = parseFloat(cleaned);
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  return num;
}
