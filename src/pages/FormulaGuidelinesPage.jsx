import { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, ListTree, Search } from 'lucide-react';
import { FORMULA_GUIDELINES, FORMULA_LABELS, FORMULA_MATH_DISPLAY, FORMULA_SYMBOLS } from '../constants/formulaConfig';

function FormulaBlock({ label, value }) {
  if (!value) return null;

  return (
    <div className="rounded-lg border-2 border-border bg-bg-base p-4">
      <p className="text-xs font-bold uppercase text-text-muted">{label}</p>
      <p
        className="mt-2 overflow-x-auto whitespace-nowrap text-[22px] leading-relaxed text-text-primary"
        style={{ fontFamily: '"Cambria Math", Cambria, "Times New Roman", serif' }}
      >
        {value}
      </p>
    </div>
  );
}

export default function FormulaGuidelinesPage({ onBack }) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const guides = useMemo(() => {
    if (!normalizedQuery) return FORMULA_GUIDELINES;
    return FORMULA_GUIDELINES.filter((guide) => {
      const formula = FORMULA_LABELS[guide.key];
      return [
        formula.label,
        formula.description,
        formula.formula,
        formula.formulaSingle,
        formula.formulaGrouped,
        guide.appliesTo,
        guide.tips,
      ].filter(Boolean).join(' ').toLowerCase().includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-bg-base">
      <div className="mx-auto max-w-[1120px] px-4 py-5 lg:px-8 lg:py-8">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-accent-soft text-accent-primary shadow-card">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-4xl font-bold leading-tight text-text-primary">Guidelines Rumus</h2>
              <p className="mt-1 max-w-2xl text-base leading-relaxed text-text-secondary">
                Ringkasan rumus yang dipakai HitunginDong untuk data tunggal, data berfrekuensi, dan data kelompok.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="focus-ring interactive-press inline-flex items-center gap-2 rounded-full border-2 border-border bg-bg-surface px-4 py-2 text-sm font-bold text-text-primary shadow-card hover:bg-accent-soft"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>
        </div>

        <div className="mb-5 rounded-full border-2 border-border bg-bg-surface px-4 py-2.5 shadow-card">
          <label className="flex items-center gap-3">
            <Search size={20} className="shrink-0 text-text-muted" />
            <span className="sr-only">Cari rumus</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari mean, median, kuartil, persentil, varian..."
              className="w-full bg-transparent text-base font-bold text-text-primary outline-none placeholder:text-text-muted"
            />
          </label>
        </div>

        <section className="mb-5 rounded-lg border-2 border-border bg-bg-surface p-5 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <ListTree size={18} className="text-accent-secondary" />
            <h3 className="text-2xl font-bold text-text-primary">Daftar Isi</h3>
          </div>
          {guides.length === 0 ? (
            <p className="text-sm text-text-secondary">Tidak ada rumus yang cocok dengan pencarian.</p>
          ) : (
            <nav className="grid gap-2 sm:grid-cols-2" aria-label="Daftar isi rumus">
              {guides.map((guide, index) => {
                const formula = FORMULA_LABELS[guide.key];
                return (
                  <a
                    key={guide.key}
                    href={`#formula-${guide.key}`}
                    className="focus-ring rounded-full border-2 border-border bg-bg-elevated px-4 py-2 text-sm font-bold text-text-primary hover:bg-accent-soft"
                  >
                    {index + 1}. {formula.label}
                  </a>
                );
              })}
            </nav>
          )}
        </section>

        <section className="mb-5 rounded-lg border-2 border-border bg-bg-surface p-5 shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-2xl font-bold text-text-primary">Notasi</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {FORMULA_SYMBOLS.map((item) => (
              <div key={item.symbol} className="flex gap-3 rounded-lg border border-border-subtle bg-bg-base/70 px-3 py-2">
                <span
                  className="min-w-10 text-lg font-bold text-accent-secondary"
                  style={{ fontFamily: '"Cambria Math", Cambria, "Times New Roman", serif' }}
                >
                  {item.symbol}
                </span>
                <span className="text-sm leading-relaxed text-text-secondary">{item.meaning}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {guides.map((guide, index) => {
            const formula = FORMULA_LABELS[guide.key];
            const math = FORMULA_MATH_DISPLAY[guide.key] || {};
            return (
              <article id={`formula-${guide.key}`} key={guide.key} className="scroll-mt-28 rounded-lg border-2 border-border bg-bg-surface p-5 shadow-card">
                <div className="mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-accent-secondary">
                    {index + 1}. {guide.appliesTo}
                  </p>
                  <h3 className="mt-1 text-3xl font-bold text-text-primary">{formula.label}</h3>
                  <p className="mt-1 text-base leading-relaxed text-text-secondary">{formula.description}</p>
                </div>

                <div className="grid gap-3">
                  <FormulaBlock label="Rumus umum" value={math.general || formula.formula} />
                  <FormulaBlock label="Data tunggal / berfrekuensi" value={math.single || formula.formulaSingle} />
                  <FormulaBlock label="Data kelompok" value={math.grouped || formula.formulaGrouped} />
                </div>

                <p className="mt-3 rounded-lg border-2 border-border bg-accent-soft px-4 py-3 text-sm font-bold leading-relaxed text-text-primary">
                  {guide.tips}
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
