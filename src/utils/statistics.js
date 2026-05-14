/**
 * Statistics functions for single and weighted data.
 * All functions are pure and operate on arrays.
 * Variance/StdDev use sample formula (n-1 divisor).
 * Q/D/P use position k(n+1)/m with linear interpolation.
 */

/**
 * Calculate mean.
 * @param {number[]} data
 * @returns {number}
 */
export function calcMean(data) {
  if (!data || data.length === 0) return 0;
  const sum = data.reduce((a, b) => a + b, 0);
  return sum / data.length;
}

/**
 * Calculate weighted mean from xiRows.
 * @param {Array<{ xi: number, fi: number }>} xiRows
 * @returns {number}
 */
export function calcWeightedMean(xiRows) {
  let sumFiXi = 0;
  let sumFi = 0;
  for (const { xi, fi } of xiRows) {
    sumFiXi += xi * fi;
    sumFi += fi;
  }
  return sumFi === 0 ? 0 : sumFiXi / sumFi;
}

/**
 * Calculate median from sorted data.
 * @param {number[]} sortedData
 * @returns {number}
 */
export function calcMedian(sortedData) {
  const n = sortedData.length;
  if (n === 0) return 0;

  const mid = Math.floor(n / 2);
  if (n % 2 === 1) {
    return sortedData[mid];
  }
  return (sortedData[mid - 1] + sortedData[mid]) / 2;
}

/**
 * Calculate mode(s) from data.
 * Returns array of all modes, or null if all frequencies equal.
 * @param {number[]} data
 * @returns {number[]|null}
 */
export function calcMode(data) {
  if (!data || data.length === 0) return null;

  const freq = {};
  for (const val of data) {
    freq[val] = (freq[val] || 0) + 1;
  }

  const maxFreq = Math.max(...Object.values(freq));

  // If all values have the same frequency, there's no mode
  const allSame = Object.values(freq).every(f => f === maxFreq);
  if (allSame && Object.keys(freq).length > 1) {
    return null;
  }

  const modes = Object.entries(freq)
    .filter(([, f]) => f === maxFreq)
    .map(([val]) => parseFloat(val))
    .sort((a, b) => a - b);

  return modes;
}

/**
 * Calculate quantile using position k(n+1)/m with linear interpolation.
 * @param {number[]} sortedData
 * @param {number} k - The k-th quantile
 * @param {number} m - The divisor (4 for quartile, 10 for decile, 100 for percentile)
 * @returns {number}
 */
function calcQuantile(sortedData, k, m) {
  const n = sortedData.length;
  const pos = (k * (n + 1)) / m;

  if (pos < 1) return sortedData[0];
  if (pos >= n) return sortedData[n - 1];

  const lower = Math.floor(pos);
  const frac = pos - lower;

  // Linear interpolation
  return sortedData[lower - 1] + frac * (sortedData[lower] - sortedData[lower - 1]);
}

/**
 * Calculate quartile Qk (k = 1, 2, 3).
 * @param {number[]} sortedData
 * @param {number} k
 * @returns {number}
 */
export function calcQuartile(sortedData, k) {
  return calcQuantile(sortedData, k, 4);
}

/**
 * Calculate decile Dk (k = 1..9).
 * @param {number[]} sortedData
 * @param {number} k
 * @returns {number}
 */
export function calcDecile(sortedData, k) {
  return calcQuantile(sortedData, k, 10);
}

/**
 * Calculate percentile Pk (k = 1..99).
 * @param {number[]} sortedData
 * @param {number} k
 * @returns {number}
 */
export function calcPercentile(sortedData, k) {
  return calcQuantile(sortedData, k, 100);
}

/**
 * Calculate sample variance (n-1 divisor).
 * @param {number[]} data
 * @param {number} mean
 * @returns {number}
 */
export function calcVariance(data, mean) {
  if (data.length <= 1) return 0;
  const sumSqDiff = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0);
  return sumSqDiff / (data.length - 1);
}

/**
 * Calculate weighted sample variance.
 * @param {Array<{ xi: number, fi: number }>} xiRows
 * @param {number} mean
 * @returns {number}
 */
export function calcWeightedVariance(xiRows, mean) {
  let sumFi = 0;
  let sumFiSqDiff = 0;
  for (const { xi, fi } of xiRows) {
    sumFi += fi;
    sumFiSqDiff += fi * Math.pow(xi - mean, 2);
  }
  return sumFi <= 1 ? 0 : sumFiSqDiff / (sumFi - 1);
}

/**
 * Calculate standard deviation from variance.
 * @param {number} variance
 * @returns {number}
 */
export function calcStdDev(variance) {
  return Math.sqrt(variance);
}

/**
 * Calculate range.
 * @param {number[]} sortedData
 * @returns {number}
 */
export function calcRange(sortedData) {
  if (sortedData.length === 0) return 0;
  return sortedData[sortedData.length - 1] - sortedData[0];
}

/**
 * Calculate IQR.
 * @param {number} q1
 * @param {number} q3
 * @returns {number}
 */
export function calcIQR(q1, q3) {
  return q3 - q1;
}

/**
 * Calculate coefficient of variation (CV).
 * Returns null if mean is 0.
 * @param {number} stdDev
 * @param {number} mean
 * @returns {number|null}
 */
export function calcCV(stdDev, mean) {
  if (mean === 0) return null;
  return (stdDev / Math.abs(mean)) * 100;
}

/**
 * Find outliers using 1.5×IQR rule.
 * @param {number[]} sortedData
 * @param {number} q1
 * @param {number} q3
 * @param {number} iqr
 * @returns {number[]}
 */
export function findOutliers(sortedData, q1, q3, iqr) {
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  return sortedData.filter(x => x < lowerFence || x > upperFence);
}

/**
 * Expand xiRows into a flat sorted array.
 * @param {Array<{ xi: number, fi: number }>} xiRows
 * @returns {number[]}
 */
export function expandXiRows(xiRows) {
  const result = [];
  for (const { xi, fi } of xiRows) {
    for (let i = 0; i < fi; i++) {
      result.push(xi);
    }
  }
  return result.sort((a, b) => a - b);
}
