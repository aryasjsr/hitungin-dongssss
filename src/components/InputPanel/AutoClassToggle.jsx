import { ToggleLeft, ToggleRight } from 'lucide-react';

export default function AutoClassToggle({ autoClass, onAutoClassChange }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onAutoClassChange(!autoClass)}
        className="focus-ring flex items-center gap-2 text-sm"
        role="switch"
        aria-checked={autoClass}
        aria-label="Auto-generate kelas interval dari data mentah"
      >
        {autoClass ? (
          <ToggleRight size={28} className="text-accent-secondary" />
        ) : (
          <ToggleLeft size={28} className="text-text-muted" />
        )}
        <span className={autoClass ? 'text-text-primary font-medium' : 'text-text-secondary'}>
          Auto dari data mentah
        </span>
      </button>
    </div>
  );
}
