const MODES = [
  { key: 'raw', label: 'Data Tunggal' },
  { key: 'frequency', label: 'Tabel xi/fi' },
  { key: 'grouped', label: 'Data Kelompok' },
];

export default function InputModeSelector({ inputMode, onModeChange }) {
  return (
    <div className="flex max-w-full gap-2 overflow-hidden rounded-full border-2 border-border bg-bg-surface p-1.5" role="radiogroup" aria-label="Mode input">
      {MODES.map(({ key, label }) => {
        const isActive = inputMode === key;
        return (
          <button
            key={key}
            role="radio"
            aria-checked={isActive}
            data-tour={`input-mode-${key}`}
            onClick={() => onModeChange(key)}
            className={`focus-ring interactive-press min-w-0 flex-1 whitespace-normal rounded-full border-2 px-1 py-2 text-[11px] font-bold leading-tight transition-transform duration-150 sm:px-3 sm:text-sm ${
              isActive
                ? 'border-border bg-accent-primary text-white shadow-card'
                : 'border-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
