import { BookOpen, CircleHelp, Save, Upload } from 'lucide-react';

export default function AppHeader({ onSave, onLoad, onStartTour, onOpenGuidelines, activePage }) {
  return (
    <header className="sticky top-0 z-50 flex min-h-20 items-center justify-between gap-4 border-b-2 border-border bg-bg-base px-4 py-3 shadow-card lg:px-8" data-tour="brand">
      <div className="flex min-w-0 items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-text-primary lg:text-[34px]">HitunginDong</h1>
          <p className="text-xs font-bold uppercase text-text-muted">Kalkulator Statistika Tendensi Pusat Untukmu</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          onClick={onStartTour}
          className="focus-ring interactive-press hidden items-center gap-2 rounded-full border-2 border-border bg-bg-surface px-3 py-2 text-sm font-bold text-text-primary shadow-card transition-transform duration-150 hover:bg-accent-soft sm:flex sm:px-4"
          aria-label="Buka tour guide"
        >
          <CircleHelp size={16} />
          <span className="hidden sm:inline">Tour</span>
        </button>
        <button
          onClick={onOpenGuidelines}
          data-tour="guidelines"
          className={`focus-ring interactive-press flex items-center gap-2 rounded-full border-2 border-border px-3 py-2 text-sm font-bold shadow-card transition-transform duration-150 sm:px-4 ${
            activePage === 'guidelines'
              ? 'bg-accent-primary text-white'
              : 'bg-bg-surface text-text-primary hover:bg-accent-soft'
          }`}
          aria-label={activePage === 'guidelines' ? 'Kembali ke calculator' : 'Buka panduan rumus'}
        >
          <BookOpen size={16} />
          <span className="hidden sm:inline">{activePage === 'guidelines' ? 'Calculator' : 'Rumus'}</span>
        </button>
        <button
          onClick={onLoad}
          disabled={activePage === 'guidelines'}
          data-tour="load-session"
          className="focus-ring interactive-press hidden items-center gap-2 rounded-full border-2 border-border bg-bg-surface px-4 py-2 text-sm font-bold text-text-primary shadow-card transition-transform duration-150 hover:bg-accent-soft disabled:opacity-45 sm:flex"
          aria-label="Muat session"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">Muat Session</span>
        </button>
        <button
          onClick={onSave}
          disabled={activePage === 'guidelines'}
          data-tour="save-session"
          className="focus-ring interactive-press flex items-center gap-2 rounded-full border-2 border-border bg-accent-secondary px-4 py-2 text-sm font-bold text-white shadow-card transition-transform duration-150 hover:bg-accent-primary disabled:opacity-45"
          aria-label="Simpan session"
        >
          <Save size={16} />
          <span className="hidden sm:inline">Simpan</span>
        </button>
      </div>
    </header>
  );
}
