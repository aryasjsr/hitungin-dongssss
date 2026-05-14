const TABS = [
  { key: 'table', label: 'Tabel' },
  { key: 'parameter', label: 'Parameter' },
  { key: 'chart', label: 'Grafik' },
];

export default function OutputTabs({ activeOutputTab, onTabChange }) {
  return (
    <div className="flex border-b border-border mb-4" role="tablist" aria-label="Output tabs">
      {TABS.map(({ key, label }) => {
        const isActive = activeOutputTab === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(key)}
            className={`focus-ring px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px ${
              isActive
                ? 'text-text-primary border-accent-primary font-semibold'
                : 'text-text-muted border-transparent hover:text-text-secondary'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
