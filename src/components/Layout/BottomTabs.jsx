import { Keyboard, Table, BarChart2 } from 'lucide-react';

const TABS = [
  { key: 'input', label: 'Input', icon: Keyboard },
  { key: 'analysis', label: 'Param/Grafik', icon: BarChart2 },
  { key: 'table', label: 'Tabel', icon: Table },
];

export default function BottomTabs({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-border bg-bg-base px-3 py-2 shadow-[0_-4px_0_0_#000] lg:hidden"
      role="tablist" aria-label="Panel navigasi">
      <div className="flex gap-2">
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(key)}
              className={`focus-ring interactive-press flex min-h-[56px] min-w-0 flex-1 flex-col items-center justify-center rounded-full border-2 border-border px-1 py-2.5 text-xs font-bold shadow-card transition-transform duration-150 ${
                isActive
                  ? 'bg-accent-primary text-white'
                  : 'bg-bg-surface text-text-secondary hover:bg-accent-soft hover:text-text-primary'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] mt-0.5 font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
