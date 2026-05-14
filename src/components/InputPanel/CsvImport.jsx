import { useMemo, useRef, useState } from 'react';
import { FileUp, Upload } from 'lucide-react';
import { parseCsvInput } from '../../utils/csvParser';
import { formatNumber } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function CsvImport({ onApplyRaw, onApplyFrequency }) {
  const [csvText, setCsvText] = useState('');
  const fileInputRef = useRef(null);
  const parsed = useMemo(() => parseCsvInput(csvText), [csvText]);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setCsvText(String(ev.target?.result || ''));
    reader.onerror = () => toast.error('Gagal membaca file CSV.');
    reader.readAsText(file);
  };

  const handleApply = () => {
    if (parsed.mode === 'frequency' && parsed.xiRows.length > 0) {
      onApplyFrequency(parsed.xiRows.map(row => ({ xi: String(row.xi), fi: String(row.fi) })));
      toast.success('CSV xi/fi diterapkan.');
      return;
    }

    if (parsed.mode === 'raw' && parsed.rawValues.length > 0) {
      onApplyRaw(parsed.rawValues.join(', '));
      toast.success('CSV data mentah diterapkan.');
      return;
    }

    toast.error('CSV belum memiliki baris valid.');
  };

  const previewRows = parsed.mode === 'frequency'
    ? parsed.xiRows.slice(0, 4).map(row => `${formatNumber(row.xi)} / ${row.fi}`)
    : parsed.rawValues.slice(0, 8).map(value => formatNumber(value));

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-text-secondary">CSV</h3>
        <p className="text-xs text-text-muted">Import data dari paste atau file.</p>
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="focus-ring inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-border rounded-md text-text-primary hover:bg-bg-elevated"
      >
        <FileUp size={14} />
        Pilih CSV
      </button>
      <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />

      <label htmlFor="csv-input" className="sr-only">Tempel CSV</label>
      <textarea
        id="csv-input"
        value={csvText}
        onChange={(event) => setCsvText(event.target.value)}
        rows={5}
        placeholder="nilai&#10;56&#10;76&#10;atau: xi,fi&#10;56,2"
        className="focus-ring w-full bg-bg-elevated border border-border rounded-sm text-text-primary font-mono text-xs p-2.5 resize-y placeholder:text-text-muted outline-none"
      />

      {csvText && (
        <div className="rounded-md border border-border-subtle bg-bg-elevated/50 p-2 text-xs text-text-muted space-y-1">
          <p>
            Mode: <span className="text-text-secondary font-medium">{parsed.mode === 'frequency' ? 'xi/fi' : 'data mentah'}</span>
            {' '}({parsed.mode === 'frequency' ? parsed.xiRows.length : parsed.rawValues.length} baris valid)
          </p>
          {previewRows.length > 0 && <p>Preview: {previewRows.join(', ')}</p>}
          {parsed.invalidRows.length > 0 && (
            <p className="text-brand-warning">
              {parsed.invalidRows.length} baris diabaikan: {parsed.invalidRows.slice(0, 2).map(row => `#${row.row}`).join(', ')}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleApply}
        disabled={!parsed.mode}
        className="focus-ring interactive-press inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-accent-primary px-3 py-2 text-sm font-bold text-white shadow-card hover:bg-accent-secondary disabled:cursor-not-allowed disabled:opacity-45"
      >
        <Upload size={15} />
        Terapkan CSV
      </button>
    </div>
  );
}
