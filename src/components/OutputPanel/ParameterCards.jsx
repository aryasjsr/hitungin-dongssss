import { formatNumber, formatMode } from '../../utils/formatters';
import { FORMULA_LABELS, FORMULA_MATH_DISPLAY } from '../../constants/formulaConfig';
import { Info } from 'lucide-react';
import { useState } from 'react';

const CARD_ACCENTS = [
  { bg: '#c1edd2', value: '#061907', label: '#274e3b' },
  { bg: '#ffffff', value: '#061907', label: '#434841' },
  { bg: '#f0eee9', value: '#061907', label: '#434841' },
  { bg: '#1a2e1a', value: '#b5cdb0', label: '#b5cdb0' },
];

function FormulaLine({ label, value }) {
  if (!value) return null;

  return (
    <div className="rounded-md border border-border-subtle bg-bg-base px-2 py-1.5">
      <p className="text-[9px] font-bold uppercase text-text-muted">{label}</p>
      <p
        className="overflow-x-auto whitespace-nowrap text-[14px] leading-snug text-text-primary"
        style={{ fontFamily: '"Cambria Math", Cambria, "Times New Roman", serif' }}
      >
        {value}
      </p>
    </div>
  );
}

function FormulaTooltip({ formulaKey, formula }) {
  const math = FORMULA_MATH_DISPLAY[formulaKey];
  const compactLines = math
    ? [
        { label: 'Umum', value: math.general },
        { label: 'Kelompok', value: math.grouped },
      ].filter(line => line.value)
    : [{ label: 'Rumus', value: formula.formula }].filter(line => line.value);

  return (
    <div className="absolute left-0 right-0 top-full z-30 mt-1.5 rounded-md border-2 border-border bg-bg-surface p-2 text-[11px] leading-snug shadow-card">
      <p className="mb-1.5 font-bold text-text-primary">{formula.description}</p>
      <div className="space-y-1">
        {compactLines.map(line => (
          <FormulaLine key={line.label} label={line.label} value={line.value} />
        ))}
      </div>
      {formula.note && <p className="mt-1.5 flex items-center gap-1 text-brand-warning"><Info size={11} />{formula.note}</p>}
    </div>
  );
}

function ParameterCard({ label, value, formulaKey, isSpecial, tooltip }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const formula = FORMULA_LABELS[formulaKey];
  const accent = CARD_ACCENTS[label.length % CARD_ACCENTS.length];

  return (
    <div
      className="relative z-0 flex min-h-[116px] flex-col justify-between rounded-lg border-2 border-border p-4 shadow-card transition-transform duration-150 hover:z-20 hover:-translate-y-1"
      style={{
        background: accent.bg,
      }}
    >
      <div className="flex items-start justify-between mb-1">
        <span className="text-sm font-bold uppercase" style={{ color: accent.label }}>{label}</span>
        {formula && (
          <button
            className="focus-ring rounded-full p-1 transition-colors hover:bg-bg-elevated"
            style={{ color: accent.label }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label={`Info rumus ${label}`}
          >
            <Info size={14} />
          </button>
        )}
      </div>
      <div
        className={`font-display mt-2 break-words text-[34px] font-bold leading-none tabular-nums ${isSpecial ? 'text-brand-warning' : ''}`}
        style={isSpecial ? undefined : { color: accent.value }}
      >
        {value}
      </div>
      {tooltip && (
        <p className="mt-2 text-xs font-bold text-text-secondary break-words">{tooltip}</p>
      )}
      {showTooltip && formula && (
        <FormulaTooltip formulaKey={formulaKey} formula={formula} />
      )}
    </div>
  );
}

export default function ParameterCards({ results, visibleKeys }) {
  if (!results) return null;

  const cards = [
    { key: 'mean', label: 'Mean', value: formatNumber(results.mean), formulaKey: 'mean' },
    { key: 'median', label: 'Median', value: formatNumber(results.median), formulaKey: 'median' },
    { key: 'mode', label: 'Modus', value: formatMode(results.mode), formulaKey: 'mode' },
    { key: 'q1', label: 'Q1', value: formatNumber(results.q1), formulaKey: 'quartile' },
    { key: 'q2', label: 'Q2', value: formatNumber(results.q2), formulaKey: 'quartile' },
    { key: 'q3', label: 'Q3', value: formatNumber(results.q3), formulaKey: 'quartile' },
    { key: 'pk', label: `P${results.selectedP}`, value: formatNumber(results.pk), formulaKey: 'percentile' },
    { key: 'range', label: 'Range', value: formatNumber(results.range), formulaKey: 'range' },
    { key: 'variance', label: 'Varian (s2)', value: formatNumber(results.variance), formulaKey: 'variance' },
    { key: 'stdDev', label: 'StdDev (s)', value: formatNumber(results.stdDev), formulaKey: 'stdDev' },
    { key: 'min', label: 'Min', value: formatNumber(results.min) },
    { key: 'max', label: 'Max', value: formatNumber(results.max) },
    { key: 'n', label: 'N', value: String(results.n) },
  ];

  if (results.outliers && results.outliers.length > 0) {
    cards.push({
      key: 'outliers',
      label: 'Outlier',
      value: `${results.outliers.length} data`,
      formulaKey: 'outlier',
      tooltip: results.outliers.map(o => formatNumber(o)).join(', '),
    });
  }

  const visibleSet = Array.isArray(visibleKeys) ? new Set(visibleKeys) : null;
  const visibleCards = visibleSet ? cards.filter(card => visibleSet.has(card.key)) : cards;

  return (
    <div className="space-y-3">
      {visibleCards.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-border bg-bg-elevated px-4 py-6 text-center text-sm font-bold text-text-secondary">
          Belum ada parameter yang dipilih untuk ditampilkan.
        </div>
      )}
      <div className="grid overflow-visible grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {visibleCards.map((card) => (
          <ParameterCard key={card.key} {...card} />
        ))}
      </div>
    </div>
  );
}
