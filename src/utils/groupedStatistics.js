/**
 * Statistics functions for grouped (interval) data.
 * Uses class interpolation for Q/D/P and median.
 * Variance uses sample formula (N-1 divisor).
 */

/**
 * Calculate grouped mean: Σfi·xi / Σfi
 * @param {Array<{ xi: number, fi: number }>} rows
 * @returns {number}
 */
export function calcGroupedMean(rows) {
  let sumFiXi = 0;
  let sumFi = 0;
  for (const row of rows) {
    sumFiXi += row.fi * row.xi;
    sumFi += row.fi;
  }
  return sumFi === 0 ? 0 : sumFiXi / sumFi;
}

/**
 * Calculate grouped median using class interpolation.
 * Median = L + ((N/2 - F) / f) × c
 * @param {Array<{ lowerBoundary: number, upperBoundary: number, fi: number, fkum: number }>} rows
 * @param {number} N - total frequency
 * @returns {number}
 */
export function calcGroupedMedian(rows, N) {
  const pos = N / 2;
  return calcGroupedQuantileByPos(rows, pos);
}

/**
 * Calculate grouped mode.
 * Mode = L + (d1 / (d1 + d2)) × c
 * @param {Array<{ lowerBoundary: number, upperBoundary: number, fi: number }>} rows
 * @returns {number|null}
 */
export function calcGroupedMode(rows) {
  if (rows.length === 0) return null;

  // Find class with highest frequency
  let maxFi = -1;
  let modeIdx = 0;
  let allSame = true;

  for (let i = 0; i < rows.length; i++) {
    if (i > 0 && rows[i].fi !== rows[0].fi) allSame = false;
    if (rows[i].fi > maxFi) {
      maxFi = rows[i].fi;
      modeIdx = i;
    }
  }

  // If all frequencies are the same, no mode
  if (allSame && rows.length > 1) return null;

  const L = rows[modeIdx].lowerBoundary;
  const c = rows[modeIdx].upperBoundary - rows[modeIdx].lowerBoundary;
  const d1 = rows[modeIdx].fi - (modeIdx > 0 ? rows[modeIdx - 1].fi : 0);
  const d2 = rows[modeIdx].fi - (modeIdx < rows.length - 1 ? rows[modeIdx + 1].fi : 0);

  if (d1 + d2 === 0) return L + c / 2;

  return L + (d1 / (d1 + d2)) * c;
}

/**
 * Internal: find the class containing position and interpolate.
 * @param {Array} rows - rows with lowerBoundary, upperBoundary, fi, fkum
 * @param {number} pos - target position
 * @returns {number}
 */
function calcGroupedQuantileByPos(rows, pos) {
  // Find the class where cumulative frequency >= pos
  let targetIdx = 0;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].fkum >= pos) {
      targetIdx = i;
      break;
    }
  }

  const L = rows[targetIdx].lowerBoundary;
  const c = rows[targetIdx].upperBoundary - rows[targetIdx].lowerBoundary;
  const f = rows[targetIdx].fi;
  const F = targetIdx > 0 ? rows[targetIdx - 1].fkum : 0;

  return L + ((pos - F) / f) * c;
}

/**
 * Calculate grouped quartile: position kN/4
 * @param {Array} rows
 * @param {number} N - total frequency
 * @param {number} k - quartile number (1, 2, 3)
 * @returns {number}
 */
export function calcGroupedQuartile(rows, N, k) {
  const pos = (k * N) / 4;
  return calcGroupedQuantileByPos(rows, pos);
}

/**
 * Calculate grouped decile: position kN/10
 * @param {Array} rows
 * @param {number} N
 * @param {number} k - decile number (1..9)
 * @returns {number}
 */
export function calcGroupedDecile(rows, N, k) {
  const pos = (k * N) / 10;
  return calcGroupedQuantileByPos(rows, pos);
}

/**
 * Calculate grouped percentile: position kN/100
 * @param {Array} rows
 * @param {number} N
 * @param {number} k - percentile number (1..99)
 * @returns {number}
 */
export function calcGroupedPercentile(rows, N, k) {
  const pos = (k * N) / 100;
  return calcGroupedQuantileByPos(rows, pos);
}

/**
 * Calculate grouped sample variance: Σfi(xi - mean)² / (N - 1)
 * @param {Array<{ xi: number, fi: number }>} rows
 * @param {number} mean
 * @param {number} N - total frequency
 * @returns {number}
 */
export function calcGroupedVariance(rows, mean, N) {
  if (N <= 1) return 0;
  let sumFiSqDiff = 0;
  for (const row of rows) {
    sumFiSqDiff += row.fi * Math.pow(row.xi - mean, 2);
  }
  return sumFiSqDiff / (N - 1);
}

/**
 * Calculate grouped standard deviation.
 * @param {number} variance
 * @returns {number}
 */
export function calcGroupedStdDev(variance) {
  return Math.sqrt(variance);
}

/**
 * Calculate grouped range (using boundaries).
 * @param {Array} rows
 * @returns {number}
 */
export function calcGroupedRange(rows) {
  if (rows.length === 0) return 0;
  return rows[rows.length - 1].upperBoundary - rows[0].lowerBoundary;
}

/**
 * Calculate grouped IQR: Q3 - Q1.
 * @param {number} q1
 * @param {number} q3
 * @returns {number}
 */
export function calcGroupedIQR(q1, q3) {
  return q3 - q1;
}

/**
 * Calculate grouped CV.
 * Returns null if mean is 0.
 * @param {number} stdDev
 * @param {number} mean
 * @returns {number|null}
 */
export function calcGroupedCV(stdDev, mean) {
  if (mean === 0) return null;
  return (stdDev / Math.abs(mean)) * 100;
}
