/**
 * Build class intervals from sorted data using Sturges' rule.
 *
 * k = ceil(1 + 3.322 * log10(n))
 * c = ceil((max - min) / k)
 *
 * @param {number[]} sortedData - Sorted array of numbers
 * @returns {Array<{
 *   classInterval: string,
 *   lower: number,
 *   upper: number,
 *   lowerBoundary: number,
 *   upperBoundary: number,
 *   xi: number,
 *   fi: number,
 *   fkum: number
 * }>}
 */
export function buildClassIntervals(sortedData) {
  if (!sortedData || sortedData.length < 2) return [];

  const n = sortedData.length;
  const min = sortedData[0];
  const max = sortedData[n - 1];

  // Sturges' rule
  const k = Math.ceil(1 + 3.322 * Math.log10(n));

  // Class width
  const range = max - min;
  let c = Math.ceil(range / k);
  if (c <= 0) c = 1; // Edge case: all values the same

  const rows = [];
  let cumFreq = 0;

  for (let i = 0; i < k; i++) {
    const lower = min + i * c;
    const upper = lower + c - 1;
    const lowerBoundary = lower - 0.5;
    const upperBoundary = upper + 0.5;
    const xi = (lower + upper) / 2;

    // Count frequency: values in [lower, upper]
    const fi = sortedData.filter(v => v >= lower && v <= upper).length;

    cumFreq += fi;

    rows.push({
      classInterval: `${lower}-${upper}`,
      lower,
      upper,
      lowerBoundary,
      upperBoundary,
      xi,
      fi,
      fkum: cumFreq,
    });
  }

  // Handle any remaining values beyond last class
  const lastRow = rows[rows.length - 1];
  const remaining = sortedData.filter(v => v > lastRow.upper).length;
  if (remaining > 0) {
    lastRow.upper = max;
    lastRow.upperBoundary = max + 0.5;
    lastRow.xi = (lastRow.lower + lastRow.upper) / 2;
    lastRow.fi += remaining;
    lastRow.fkum += remaining;
    lastRow.classInterval = `${lastRow.lower}-${lastRow.upper}`;
  }

  return rows;
}
