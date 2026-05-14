import { Calculator, Loader2 } from 'lucide-react';

export default function AnalyzeButton({ onClick, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`focus-ring interactive-press flex w-full items-center justify-center gap-2 rounded-full border-2 border-border px-6 py-3 text-sm font-bold transition-transform duration-150 disabled:cursor-not-allowed disabled:opacity-45 disabled:transform-none ${
        !(disabled || loading) ? 'bg-accent-primary text-white shadow-card hover:bg-accent-secondary' : 'bg-bg-elevated text-text-muted'
      }`}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Calculator size={18} />
      )}
      {loading ? 'Memproses...' : 'Analisis Data'}
    </button>
  );
}
