import { Plus, Trash2 } from 'lucide-react';
import AutoClassToggle from './AutoClassToggle';

export default function GroupedDataInput({ groupedRows, onChange, autoClass, onAutoClassChange, rawTextForAuto, onRawTextForAutoChange, generatedRows }) {
  const updateRow = (index, field, value) => {
    const updated = [...groupedRows];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addRow = () => {
    onChange([...groupedRows, { classInterval: '', fi: '' }]);
  };

  const removeRow = (index) => {
    if (groupedRows.length <= 1) {
      onChange([{ classInterval: '', fi: '' }]);
      return;
    }
    onChange(groupedRows.filter((_, i) => i !== index));
  };

  return (
    <div>
      <AutoClassToggle autoClass={autoClass} onAutoClassChange={onAutoClassChange} />

      {autoClass ? (
        <div className="mt-4">
          <label htmlFor="auto-class-raw-input" className="block text-sm font-medium text-text-secondary mb-2">
            Data Mentah (untuk auto-generate kelas)
          </label>
          <textarea
            id="auto-class-raw-input"
            value={rawTextForAuto}
            onChange={(e) => onRawTextForAutoChange(e.target.value)}
            placeholder="Contoh: 56, 76, 45, 89, 67, 80, 72, 55, 90, 62"
            rows={5}
            className="focus-ring w-full bg-bg-elevated border border-border rounded-sm text-text-primary font-mono text-sm p-3 resize-y placeholder:text-text-muted transition-colors duration-150 focus:border-accent-primary focus:shadow-[4px_4px_0_0_#8ab49c] outline-none"
            style={{ minHeight: '100px' }}
          />
          {generatedRows && generatedRows.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-text-muted mb-2 font-medium uppercase tracking-wider">Preview Kelas Interval</p>
              <div className="overflow-x-auto border border-border rounded-md">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-bg-elevated text-text-secondary">
                      <th className="px-3 py-2 text-left font-semibold">Interval</th>
                      <th className="px-3 py-2 text-right font-semibold">fi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedRows.map((row, i) => (
                      <tr key={i} className="border-t border-border-subtle">
                        <td className="px-3 py-2 font-mono text-text-primary">{row.classInterval}</td>
                        <td className="px-3 py-2 font-mono text-right text-text-primary">{row.fi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Interval Kelas & Frekuensi
          </label>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_80px_40px] gap-2 px-1">
              <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Interval</span>
              <span className="text-xs text-text-muted font-medium uppercase tracking-wider">fi</span>
              <span></span>
            </div>
            {groupedRows.map((row, index) => {
              const fiInvalid = row.fi !== '' && (isNaN(Number(row.fi)) || !Number.isInteger(Number(row.fi)) || Number(row.fi) < 1);
              return (
                <div key={index} className="grid grid-cols-[1fr_80px_40px] gap-2 items-center">
                  <input
                    type="text"
                    value={row.classInterval}
                    onChange={(e) => updateRow(index, 'classInterval', e.target.value)}
                    placeholder="40-49"
                    aria-label={`Interval kelas baris ${index + 1}`}
                    className="focus-ring w-full bg-bg-elevated border border-border rounded-sm text-text-primary font-mono text-sm p-2.5 outline-none transition-colors duration-150 focus:border-accent-primary focus:shadow-[4px_4px_0_0_#8ab49c]"
                  />
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={row.fi}
                    onChange={(e) => updateRow(index, 'fi', e.target.value)}
                    placeholder="fi"
                    aria-label={`Frekuensi baris ${index + 1}`}
                    className={`focus-ring w-full bg-bg-elevated border rounded-sm text-text-primary font-mono text-sm p-2.5 outline-none transition-colors duration-150 focus:border-accent-primary focus:shadow-[4px_4px_0_0_#8ab49c] ${
                      fiInvalid ? 'border-brand-error shadow-[0_0_0_3px_rgba(239,68,68,0.15)]' : 'border-border'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    aria-label={`Hapus baris ${index + 1}`}
                    className="focus-ring flex items-center justify-center w-10 h-10 rounded-sm text-text-muted hover:text-brand-error hover:bg-brand-error/10 transition-colors duration-150"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={addRow}
            className="focus-ring mt-3 flex items-center gap-1.5 px-3 py-2 text-sm text-accent-secondary hover:text-accent-primary border border-border rounded-md hover:bg-bg-elevated transition-colors duration-150"
          >
            <Plus size={16} />
            Tambah Baris
          </button>
        </div>
      )}
    </div>
  );
}
