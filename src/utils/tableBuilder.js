/**
 * Build output table for single/weighted data (xiRows format).
 * @param {Array<{ xi: number, fi: number }>} xiRows
 * @returns {{ rows: Array, totals: { sumFi: number, sumXiFi: number, sumXi2Fi: number } }}
 */
export function buildSingleTable(xiRows) {
  let cumFreq = 0;
  const rows = xiRows.map(({ xi, fi }) => {
    cumFreq += fi;
    const xiFi = xi * fi;
    const xi2Fi = xi * xi * fi;
    return {
      xi,
      fi,
      fkum: cumFreq,
      xiFi,
      xi2Fi,
    };
  });

  const totals = {
    sumFi: rows.reduce((sum, r) => sum + r.fi, 0),
    sumXiFi: rows.reduce((sum, r) => sum + r.xiFi, 0),
    sumXi2Fi: rows.reduce((sum, r) => sum + r.xi2Fi, 0),
  };

  return { rows, totals };
}

/**
 * Build output table for grouped data.
 * @param {Array<{
 *   classInterval: string,
 *   lower: number,
 *   upper: number,
 *   lowerBoundary: number,
 *   upperBoundary: number,
 *   xi: number,
 *   fi: number
 * }>} groupedRows
 * @returns {{ rows: Array, totals: { sumFi: number, sumXiFi: number, sumXi2Fi: number } }}
 */
export function buildGroupedTable(groupedRows) {
  let cumFreq = 0;
  const rows = groupedRows.map((row) => {
    cumFreq += row.fi;
    const xiFi = row.xi * row.fi;
    const xi2Fi = row.xi * row.xi * row.fi;
    return {
      classInterval: row.classInterval,
      lower: row.lower,
      upper: row.upper,
      lowerBoundary: row.lowerBoundary,
      upperBoundary: row.upperBoundary,
      xi: row.xi,
      fi: row.fi,
      fkum: cumFreq,
      xiFi,
      xi2Fi,
    };
  });

  const totals = {
    sumFi: rows.reduce((sum, r) => sum + r.fi, 0),
    sumXiFi: rows.reduce((sum, r) => sum + r.xiFi, 0),
    sumXi2Fi: rows.reduce((sum, r) => sum + r.xi2Fi, 0),
  };

  return { rows, totals };
}
