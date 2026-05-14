import { formatNumber } from '../../utils/formatters';

export default function DataTable({ results }) {
  if (!results || !results.table) return null;

  const { rows, totals } = results.table;
  const isGrouped = results.dataType === 'kelompok';

  return (
    <div className="overflow-x-auto rounded-lg border-2 border-border bg-bg-surface shadow-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-border bg-accent-soft text-text-primary">
            {isGrouped && (
              <>
                <th scope="col" className="border-r-2 border-border px-4 py-3 text-left font-bold">Interval</th>
                <th scope="col" className="border-r-2 border-border px-4 py-3 text-right font-bold">Tepi Bawah</th>
                <th scope="col" className="border-r-2 border-border px-4 py-3 text-right font-bold">Tepi Atas</th>
              </>
            )}
            <th scope="col" className="border-r-2 border-border px-4 py-3 text-right font-bold">xi</th>
            <th scope="col" className="border-r-2 border-border px-4 py-3 text-right font-bold">fi</th>
            <th scope="col" className="border-r-2 border-border px-4 py-3 text-right font-bold">F kum</th>
            <th scope="col" className="border-r-2 border-border px-4 py-3 text-right font-bold">xi.fi</th>
            <th scope="col" className="px-4 py-3 text-right font-bold">xi2.fi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-border-subtle hover:bg-bg-elevated transition-colors duration-100">
              {isGrouped && (
                <>
                  <td className="border-r border-border-subtle px-4 py-3 font-mono font-bold text-text-primary">{row.classInterval}</td>
                  <td className="border-r border-border-subtle px-4 py-3 font-mono text-right text-text-primary tabular-nums">{formatNumber(row.lowerBoundary, 1)}</td>
                  <td className="border-r border-border-subtle px-4 py-3 font-mono text-right text-text-primary tabular-nums">{formatNumber(row.upperBoundary, 1)}</td>
                </>
              )}
              <td className="border-r border-border-subtle px-4 py-3 font-mono text-right text-text-primary tabular-nums">{formatNumber(row.xi)}</td>
              <td className="border-r border-border-subtle px-4 py-3 font-mono text-right text-text-primary tabular-nums">{row.fi}</td>
              <td className="border-r border-border-subtle px-4 py-3 font-mono text-right text-text-primary tabular-nums">{row.fkum}</td>
              <td className="border-r border-border-subtle px-4 py-3 font-mono text-right text-text-primary tabular-nums">{formatNumber(row.xiFi)}</td>
              <td className="px-4 py-3 font-mono text-right text-text-primary tabular-nums">{formatNumber(row.xi2Fi)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border bg-bg-elevated font-bold">
            {isGrouped ? (
              <>
                <td className="border-r border-border-subtle px-4 py-3 text-text-secondary" colSpan={3}>Total</td>
                <td className="border-r border-border-subtle px-4 py-3"></td>
              </>
            ) : (
              <td className="border-r border-border-subtle px-4 py-3 text-text-secondary">Total</td>
            )}
            <td className="border-r border-border-subtle px-4 py-3 font-mono text-right text-accent-secondary tabular-nums">{totals.sumFi}</td>
            <td className="border-r border-border-subtle px-4 py-3"></td>
            <td className="border-r border-border-subtle px-4 py-3 font-mono text-right text-accent-secondary tabular-nums">{formatNumber(totals.sumXiFi)}</td>
            <td className="px-4 py-3 font-mono text-right text-accent-secondary tabular-nums">{formatNumber(totals.sumXi2Fi)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
