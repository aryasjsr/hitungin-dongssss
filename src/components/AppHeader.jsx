import { BookOpen, CircleHelp, Save, Upload } from 'lucide-react';

export default function AppHeader({ onSave, onLoad, onStartTour, onOpenGuidelines, activePage }) {
  return (
    <header className="sticky top-0 z-50 flex min-h-20 items-center justify-between gap-3 border-b-2 border-border bg-bg-base px-4 py-3 shadow-card lg:px-8" data-tour="brand">
      <div className="flex min-w-0 items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-text-primary lg:text-[34px]">HitunginDong</h1>
          <p className="text-xs font-bold uppercase text-text-muted">Kalkulator Statistika Tendensi Pusat Untukmu</p>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-1.5 sm:flex sm:items-center sm:gap-3">
        <button
          onClick={onStartTour}
          className="focus-ring interactive-press flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-bg-surface text-sm font-bold text-text-primary shadow-card transition-transform duration-150 hover:bg-accent-soft sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2"
          aria-label="Buka tour guide"
        >
          <CircleHelp size={15} />
          <span className="hidden sm:inline">Tour</span>
        </button>
        <button
          onClick={onOpenGuidelines}
          data-tour="guidelines"
          className={`focus-ring interactive-press flex h-8 w-8 items-center justify-center rounded-full border-2 border-border text-sm font-bold shadow-card transition-transform duration-150 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2 ${
            activePage === 'guidelines'
              ? 'bg-accent-primary text-white'
              : 'bg-bg-surface text-text-primary hover:bg-accent-soft'
          }`}
          aria-label={activePage === 'guidelines' ? 'Kembali ke calculator' : 'Buka panduan rumus'}
        >
          <BookOpen size={15} />
          <span className="hidden sm:inline">{activePage === 'guidelines' ? 'Calculator' : 'Rumus'}</span>
        </button>
        <button
          onClick={onLoad}
          disabled={activePage === 'guidelines'}
          data-tour="load-session"
          className="focus-ring interactive-press flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-bg-surface text-sm font-bold text-text-primary shadow-card transition-transform duration-150 hover:bg-accent-soft disabled:opacity-45 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2"
          aria-label="Muat session"
        >
          <Upload size={15} />
          <span className="hidden sm:inline">Muat Session</span>
        </button>
        <button
          onClick={onSave}
          disabled={activePage === 'guidelines'}
          data-tour="save-session"
          className="focus-ring interactive-press flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-accent-secondary text-sm font-bold text-white shadow-card transition-transform duration-150 hover:bg-accent-primary disabled:opacity-45 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2"
          aria-label="Simpan session"
        >
          <Save size={15} />
          <span className="hidden sm:inline">Simpan</span>
        </button>
      </div>
    </header>
  );
}
