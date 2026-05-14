import { formatNumber } from './formatters';

/**
 * Generate an auto-interpretation string in bahasa Indonesia (2–4 sentences).
 * Covers: skewness direction, dispersion level, outlier presence.
 *
 * @param {object} results - Calculation results
 * @returns {string}
 */
export function generateInterpretation(results) {
  if (!results) return '';

  const sentences = [];

  // 1. Skewness
  sentences.push(getSkewnessSentence(results.mean, results.median));

  // 2. Dispersion
  sentences.push(getDispersionSentence(results.cv, results.mean, results.stdDev));

  // 3. Outliers
  const outlierSentence = getOutlierSentence(results.outliers);
  if (outlierSentence) {
    sentences.push(outlierSentence);
  }

  return sentences.filter(Boolean).join(' ');
}

/**
 * Describe skewness based on mean vs median comparison.
 */
function getSkewnessSentence(mean, median) {
  if (mean === undefined || median === undefined || mean === null || median === null) {
    return 'Informasi skewness tidak tersedia.';
  }

  const diff = mean - median;
  const tolerance = Math.abs(mean) * 0.01; // 1% tolerance

  if (Math.abs(diff) <= tolerance) {
    return `Distribusi data cenderung simetris (mean ≈ median = ${formatNumber(mean)}).`;
  } else if (diff > 0) {
    return `Distribusi data cenderung menceng positif (skew kanan), karena mean (${formatNumber(mean)}) lebih besar dari median (${formatNumber(median)}).`;
  } else {
    return `Distribusi data cenderung menceng negatif (skew kiri), karena mean (${formatNumber(mean)}) lebih kecil dari median (${formatNumber(median)}).`;
  }
}

/**
 * Describe dispersion using CV categories.
 */
function getDispersionSentence(cv, mean, stdDev) {
  if (mean === 0 || cv === null || cv === undefined) {
    if (stdDev !== undefined && stdDev !== null) {
      return `Standar deviasi sebesar ${formatNumber(stdDev)} menunjukkan sebaran data (CV tidak terdefinisi karena mean = 0).`;
    }
    return 'CV tidak dapat dihitung karena mean bernilai nol.';
  }

  if (cv < 15) {
    return `Tingkat sebaran data tergolong rendah (CV = ${formatNumber(cv)}%), menunjukkan data relatif homogen.`;
  } else if (cv <= 30) {
    return `Tingkat sebaran data tergolong sedang (CV = ${formatNumber(cv)}%), menunjukkan variasi data yang moderat.`;
  } else {
    return `Tingkat sebaran data tergolong tinggi (CV = ${formatNumber(cv)}%), menunjukkan data cukup bervariasi.`;
  }
}

/**
 * Describe outlier presence.
 */
function getOutlierSentence(outliers) {
  if (!outliers || outliers.length === 0) {
    return 'Tidak ditemukan outlier berdasarkan aturan 1,5×IQR.';
  }

  const formatted = outliers.map(o => formatNumber(o)).join(', ');
  return `Terdapat ${outliers.length} kemungkinan outlier: ${formatted}.`;
}
