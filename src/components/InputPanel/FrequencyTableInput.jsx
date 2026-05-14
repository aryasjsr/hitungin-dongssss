import { Plus, Trash2 } from 'lucide-react';

export default function FrequencyTableInput({ xiRows, onChange }) {
  const updateRow = (index, field, value) => {
    const updated = [...xiRows];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addRow = () => {
    onChange([...xiRows, { xi: '', fi: '' }]);
  };

  const removeRow = (index) => {
    if (xiRows.length <= 1) {
      onChange([{ xi: '', fi: '' }]);
      return;
    }
    onChange(xiRows.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">
        Tabel Frekuensi (xi / fi)
      </label>

      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_40px] gap-2 px-1">
          <span className="text-xs text-text-muted font-medium uppercase tracking-wider">xi (Nilai)</span>
          <span className="text-xs text-text-muted font-medium uppercase tracking-wider">fi (Frekuensi)</span>
          <span></span>
        </div>

        {/* Rows */}
        {xiRows.map((row, index) => {
          const fiInvalid = row.fi !== '' && (isNaN(Number(row.fi)) || !Number.isInteger(Number(row.fi)) || Number(row.fi) < 1);
          return (
            <div key={index} className="grid grid-cols-[1fr_1fr_40px] gap-2 items-center">
              <input
                type="number"
                step="any"
                value={row.xi}
                onChange={(e) => updateRow(index, 'xi', e.target.value)}
                placeholder="xi"
                aria-label={`Nilai xi baris ${index + 1}`}
                className="focus-ring w-full bg-bg-elevated border border-border rounded-sm text-text-primary font-mono text-sm p-2.5 outline-none transition-colors duration-150 focus:border-accent-primary focus:shadow-[4px_4px_0_0_#8ab49c]"
              />
              <input
                type="number"
                step="1"
                min="1"
                value={row.fi}
                onChange={(e) => updateRow(index, 'fi', e.target.value)}
                placeholder="fi"
                aria-label={`Frekuensi fi baris ${index + 1}`}
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
  );
}
