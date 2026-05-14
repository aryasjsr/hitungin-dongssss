/**
 * Format a number to a specified number of decimal places.
 * Removes trailing zeros.
 * @param {number} value
 * @param {number} decimals - Max decimal places (default 4)
 * @returns {string}
 */
export function formatNumber(value, decimals = 4) {
  if (value === null || value === undefined || isNaN(value)) return '-';
  if (!isFinite(value)) return '∞';

  // Use toFixed, then remove trailing zeros
  const fixed = value.toFixed(decimals);
  // Remove trailing zeros after decimal point
  if (fixed.includes('.')) {
    return fixed.replace(/\.?0+$/, '') || '0';
  }
  return fixed;
}

/**
 * Format CV value.
 * @param {number|null} cv - CV value (already in percentage)
 * @param {number} mean
 * @returns {string}
 */
export function formatCV(cv, mean) {
  if (mean === 0 || cv === null || cv === undefined) {
    return 'Tidak terdefinisi';
  }
  return `${formatNumber(cv)}%`;
}

/**
 * Format mode values.
 * @param {number[]|null} modes - Array of mode values, or null for no mode
 * @returns {string}
 */
export function formatMode(modes) {
  if (!modes || modes.length === 0) {
    return 'Tidak ada modus';
  }
  return modes.map(m => formatNumber(m)).join(', ');
}
