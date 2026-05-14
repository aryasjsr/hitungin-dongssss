import { MIN_DATA, MAX_DATA, WARN_DATA } from '../constants/appLimits';

/**
 * Validate data count.
 * @param {number} n - Number of valid data points
 * @returns {{ valid: boolean, error?: string, warning?: string }}
 */
export function validateDataCount(n) {
  if (n < MIN_DATA) {
    return {
      valid: false,
      error: `Minimal diperlukan ${MIN_DATA} data valid untuk analisis.`,
    };
  }
  if (n > MAX_DATA) {
    return {
      valid: false,
      error: `Maksimal ${MAX_DATA.toLocaleString('id-ID')} data yang diperbolehkan.`,
    };
  }
  const warning = n > WARN_DATA
    ? 'Dataset besar terdeteksi (> 1.000). Proses mungkin lebih lambat.'
    : undefined;

  return { valid: true, warning };
}

/**
 * Validate a frequency value (fi).
 * Must be a positive integer >= 1.
 * @param {*} fi
 * @returns {boolean}
 */
export function validateFi(fi) {
  if (fi === null || fi === undefined || fi === '') return false;
  const n = Number(fi);
  return Number.isInteger(n) && n >= 1;
}

/**
 * Validate a grouped row object.
 * @param {{ lower: number, upper: number, fi: number }} row
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateGroupedRow(row) {
  if (row.lower === undefined || row.upper === undefined) {
    return { valid: false, error: 'Batas bawah dan atas kelas harus diisi.' };
  }
  if (isNaN(row.lower) || isNaN(row.upper)) {
    return { valid: false, error: 'Batas kelas harus berupa angka.' };
  }
  if (row.lower >= row.upper) {
    return { valid: false, error: 'Batas bawah harus lebih kecil dari batas atas.' };
  }
  if (!validateFi(row.fi)) {
    return { valid: false, error: 'Frekuensi harus berupa bilangan bulat positif (≥ 1).' };
  }
  return { valid: true };
}

/**
 * Parse interval text like "40-49" or "40 - 49" into lower and upper bounds.
 * @param {string} text
 * @returns {{ lower: number, upper: number } | { error: string }}
 */
export function validateIntervalFormat(text) {
  if (!text || typeof text !== 'string') {
    return { error: 'Format interval kelas tidak valid.' };
  }

  const cleaned = text.trim();
  // Match patterns like: "40-49", "40 - 49", "40–49"
  const match = cleaned.match(/^(-?\d+\.?\d*)\s*[-–]\s*(-?\d+\.?\d*)$/);

  if (!match) {
    return { error: 'Format interval kelas tidak valid. Gunakan format: "40-49".' };
  }

  const lower = parseFloat(match[1]);
  const upper = parseFloat(match[2]);

  if (isNaN(lower) || isNaN(upper)) {
    return { error: 'Batas kelas harus berupa angka.' };
  }

  if (lower >= upper) {
    return { error: 'Batas bawah harus lebih kecil dari batas atas.' };
  }

  return { lower, upper };
}
