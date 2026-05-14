import { BookOpen } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export default function InterpretationPanel({ results }) {
  if (!results) return null;

  return (
    <div className="bg-bg-surface border border-border rounded-xl p-6 hover-glow transition-all duration-300" style={{ borderLeft: '4px solid #3f6652' }}>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={20} className="text-accent-secondary" />
        <h3 className="text-lg font-bold text-text-primary">Interpretasi Statistik</h3>
      </div>

      <p className="text-text-secondary leading-relaxed text-sm font-medium">
        {results.interpretation}
      </p>

      {/* Summary statistics */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-bg-elevated rounded-lg p-4 border border-border">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.08em]">Min</span>
          <p className="font-mono text-xl font-bold text-text-primary tabular-nums mt-1">{formatNumber(results.min)}</p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-4 border border-border">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.08em]">Max</span>
          <p className="font-mono text-xl font-bold text-text-primary tabular-nums mt-1">{formatNumber(results.max)}</p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-4 border border-border">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.08em]">Jumlah Data</span>
          <p className="font-mono text-xl font-bold text-text-primary tabular-nums mt-1">{results.n}</p>
        </div>
        {results.outliers && results.outliers.length > 0 && (
          <div className="bg-bg-elevated rounded-lg p-4 border border-brand-warning/30 bg-brand-warning/5">
            <span className="text-[11px] font-bold text-brand-warning uppercase tracking-[0.08em]">Outlier</span>
            <p className="font-mono text-xl font-bold text-brand-warning tabular-nums mt-1">{results.outliers.length} data</p>
          </div>
        )}
      </div>
    </div>
  );
}
