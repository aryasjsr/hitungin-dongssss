import { useCallback } from 'react';
import {
  calcMean, calcMedian, calcMode, calcQuartile, calcPercentile,
  calcVariance, calcStdDev, calcRange, calcIQR, calcCV, findOutliers,
  calcWeightedMean, calcWeightedVariance, expandXiRows,
} from '../utils/statistics';
import {
  calcGroupedMean, calcGroupedMedian, calcGroupedMode,
  calcGroupedQuartile, calcGroupedPercentile,
  calcGroupedVariance, calcGroupedStdDev, calcGroupedRange,
  calcGroupedIQR, calcGroupedCV,
} from '../utils/groupedStatistics';
import { buildSingleTable, buildGroupedTable } from '../utils/tableBuilder';

/**
 * Hook that orchestrates statistical calculation based on inputMode/dataType.
 *
 * @param {object} params
 * @param {string} params.inputMode - 'raw' | 'frequency' | 'grouped'
 * @param {number[]} params.rawData - parsed raw data
 * @param {Array<{ xi: number, fi: number }>} params.xiRows - frequency table data
 * @param {Array} params.groupedRows - grouped interval data
 * @param {number} params.selectedP - selected percentile (1-99)
 * @returns {object|null} results
 */
export function useStatCalc({ inputMode, rawData, xiRows, groupedRows, selectedP }) {
  const calculate = useCallback(() => {
    if (inputMode === 'raw') {
      return calcSingleStats(rawData, selectedP);
    } else if (inputMode === 'frequency') {
      return calcWeightedStats(xiRows, selectedP);
    } else if (inputMode === 'grouped') {
      return calcGroupedStats(groupedRows, selectedP);
    }
    return null;
  }, [inputMode, rawData, xiRows, groupedRows, selectedP]);

  return { calculate };
}

function calcSingleStats(data, selectedP) {
  if (!data || data.length < 2) return null;

  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = calcMean(sorted);
  const median = calcMedian(sorted);
  const mode = calcMode(sorted);
  const q1 = calcQuartile(sorted, 1);
  const q2 = calcQuartile(sorted, 2);
  const q3 = calcQuartile(sorted, 3);
  const pk = calcPercentile(sorted, selectedP);
  const variance = calcVariance(sorted, mean);
  const stdDev = calcStdDev(variance);
  const range = calcRange(sorted);
  const iqr = calcIQR(q1, q3);
  const cv = calcCV(stdDev, mean);
  const outliers = findOutliers(sorted, q1, q3, iqr);
  const min = sorted[0];
  const max = sorted[n - 1];

  // Build xiRows for table (collapse same values)
  const freqMap = {};
  for (const v of sorted) {
    freqMap[v] = (freqMap[v] || 0) + 1;
  }
  const xiRows = Object.entries(freqMap)
    .map(([xi, fi]) => ({ xi: parseFloat(xi), fi }))
    .sort((a, b) => a.xi - b.xi);

  const table = buildSingleTable(xiRows);

  const results = {
    dataType: 'tunggal',
    n,
    mean, median, mode,
    q1, q2, q3,
    pk,
    selectedP,
    variance, stdDev, range, iqr, cv,
    outliers, min, max,
    table,
    xiRows,
  };

  return results;
}

function calcWeightedStats(xiRows, selectedP) {
  if (!xiRows || xiRows.length < 1) return null;

  const sorted = expandXiRows(xiRows);
  const n = sorted.length;
  if (n < 2) return null;

  const mean = calcWeightedMean(xiRows);
  const median = calcMedian(sorted);
  const mode = calcMode(sorted);
  const q1 = calcQuartile(sorted, 1);
  const q2 = calcQuartile(sorted, 2);
  const q3 = calcQuartile(sorted, 3);
  const pk = calcPercentile(sorted, selectedP);
  const variance = calcWeightedVariance(xiRows, mean);
  const stdDev = calcStdDev(variance);
  const range = calcRange(sorted);
  const iqr = calcIQR(q1, q3);
  const cv = calcCV(stdDev, mean);
  const outliers = findOutliers(sorted, q1, q3, iqr);
  const min = sorted[0];
  const max = sorted[n - 1];

  const table = buildSingleTable(xiRows);

  const results = {
    dataType: 'berbobot',
    n,
    mean, median, mode,
    q1, q2, q3,
    pk,
    selectedP,
    variance, stdDev, range, iqr, cv,
    outliers, min, max,
    table,
    xiRows,
  };

  return results;
}

function calcGroupedStats(groupedRows, selectedP) {
  if (!groupedRows || groupedRows.length < 1) return null;

  // Ensure cumulative frequency is computed
  let cumFreq = 0;
  const rows = groupedRows.map(row => {
    cumFreq += row.fi;
    return { ...row, fkum: cumFreq };
  });

  const N = cumFreq;
  if (N < 2) return null;

  const mean = calcGroupedMean(rows);
  const median = calcGroupedMedian(rows, N);
  const mode = calcGroupedMode(rows);
  const q1 = calcGroupedQuartile(rows, N, 1);
  const q2 = calcGroupedQuartile(rows, N, 2);
  const q3 = calcGroupedQuartile(rows, N, 3);
  const pk = calcGroupedPercentile(rows, N, selectedP);
  const variance = calcGroupedVariance(rows, mean, N);
  const stdDev = calcGroupedStdDev(variance);
  const range = calcGroupedRange(rows);
  const iqr = calcGroupedIQR(q1, q3);
  const cv = calcGroupedCV(stdDev, mean);
  const min = rows[0].lowerBoundary;
  const max = rows[rows.length - 1].upperBoundary;

  const table = buildGroupedTable(rows);

  const results = {
    dataType: 'kelompok',
    n: N,
    mean, median,
    mode: mode !== null ? [mode] : null,
    q1, q2, q3,
    pk,
    selectedP,
    variance, stdDev, range, iqr, cv,
    outliers: [], // Outliers not computed for grouped data
    min, max,
    table,
    groupedRows: rows,
  };

  return results;
}
