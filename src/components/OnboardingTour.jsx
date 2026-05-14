import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const TOUR_STEPS = [
  {
    selector: '[data-tour="brand"]',
    title: 'Selamat datang di HitunginDong',
    focusLabel: 'Header aplikasi',
    body: 'Masukkan data, pilih parameter, lalu aplikasi akan membuat analisis statistik deskriptif langsung di browser.',
  },
  {
    selector: '[data-tour="input-method"]',
    title: 'Pilih cara input',
    focusLabel: 'Tab metode input',
    body: 'Gunakan input manual, CSV, atau voice. Untuk data manual, pilih data mentah, tabel xi/fi, atau data kelompok.',
  },
  {
    selector: '[data-tour="input-tab-csv"]',
    title: 'Input CSV',
    focusLabel: 'Tab CSV',
    body: 'Pilih CSV untuk menempel data dari spreadsheet atau mengunggah file CSV. Aplikasi akan membaca format data mentah atau pasangan xi/fi.',
  },
  {
    selector: '[data-tour="input-tab-voice"]',
    title: 'Input Voice',
    focusLabel: 'Tab Voice',
    body: 'Pilih Voice untuk memasukkan angka lewat suara. Mode ini cocok saat data dibacakan satu per satu tanpa mengetik manual.',
  },
  {
    selector: '[data-tour="data-entry"]',
    title: 'Isi data utama',
    focusLabel: 'Area pengisian data',
    body: 'Ketik angka dengan pemisah koma, spasi, atau baris baru. Preview akan memberi tahu jumlah data dan token yang tidak terbaca.',
  },
  {
    selector: '[data-tour="input-mode-frequency"]',
    title: 'Data Frekuensi',
    focusLabel: 'Mode tabel xi/fi',
    body: 'Pilih Tabel xi/fi ketika nilai data sudah diringkas bersama frekuensinya. Isi xi sebagai nilai dan fi sebagai banyak kemunculannya.',
  },
  {
    selector: '[data-tour="input-mode-grouped"]',
    title: 'Data Kelompok',
    focusLabel: 'Mode data kelompok',
    body: 'Pilih Data Kelompok untuk data interval kelas. Kamu bisa membuat kelas otomatis dari data mentah atau mengisi interval dan frekuensi sendiri.',
  },
  {
    selector: '[data-tour="percentile"]',
    title: 'Atur persentil',
    focusLabel: 'Kontrol persentil Pk',
    body: 'Slider Pk menentukan persentil yang ingin dihitung. Default-nya P50, tetapi bisa diubah sesuai kebutuhan.',
  },
  {
    selector: '[data-tour="analyze"]',
    title: 'Jalankan analisis',
    focusLabel: 'Tombol analisis data',
    body: 'Tombol analisis aktif setelah data valid. Hasil akan muncul sebagai parameter, grafik frekuensi, dan tabel.',
  },
  {
    selector: '[data-tour="output"]',
    title: 'Baca dan ekspor hasil',
    focusLabel: 'Panel hasil analisis',
    body: 'Panel kanan menampilkan report analisis. Setelah ada hasil, kamu bisa mengatur parameter yang tampil dan mengekspor laporan.',
  },
  {
    selector: '[data-tour="guidelines"]',
    title: 'Buka panduan rumus',
    focusLabel: 'Tombol halaman rumus',
    body: 'Tombol Rumus membuka halaman guidelines lengkap untuk setiap parameter, termasuk rumus data tunggal dan kelompok.',
  },
  {
    selector: '[data-tour="load-session"]',
    title: 'Muat Session',
    focusLabel: 'Tombol Muat Session',
    body: 'Gunakan Muat Session untuk membuka file session JSON yang pernah disimpan. Data input akan dipulihkan dan hasil dihitung ulang.',
  },
  {
    selector: '[data-tour="save-session"]',
    title: 'Simpan Session',
    focusLabel: 'Tombol Simpan',
    body: 'Gunakan Simpan untuk menyimpan input, mode data, persentil, dan pengaturan ke file session JSON agar bisa dilanjutkan nanti.',
  },
];

function getPopoverPosition(rect) {
  const margin = 16;
  const popoverWidth = Math.min(360, window.innerWidth - margin * 2);
  const popoverHeight = 270;
  const spaceRight = window.innerWidth - rect.right;
  const spaceLeft = rect.left;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const centeredTop = Math.min(
    Math.max(margin, rect.top + rect.height / 2 - popoverHeight / 2),
    window.innerHeight - popoverHeight - margin,
  );
  const centeredLeft = Math.min(
    Math.max(margin, rect.left + rect.width / 2 - popoverWidth / 2),
    window.innerWidth - popoverWidth - margin,
  );

  if (rect.top < 96 && spaceBelow >= popoverHeight + margin) {
    return { top: rect.bottom + margin, left: centeredLeft, width: popoverWidth };
  }

  if (spaceRight >= popoverWidth + margin * 2) {
    return { top: centeredTop, left: rect.right + margin, width: popoverWidth };
  }

  if (spaceLeft >= popoverWidth + margin * 2) {
    return { top: centeredTop, left: rect.left - popoverWidth - margin, width: popoverWidth };
  }

  if (spaceBelow >= popoverHeight + margin) {
    return { top: rect.bottom + margin, left: centeredLeft, width: popoverWidth };
  }

  if (spaceAbove >= popoverHeight + margin) {
    return { top: rect.top - popoverHeight - margin, left: centeredLeft, width: popoverWidth };
  }

  const fallbackTop = rect.top > window.innerHeight / 2
    ? margin
    : Math.max(margin, window.innerHeight - popoverHeight - margin);
  return { top: fallbackTop, left: centeredLeft, width: popoverWidth };
}

export default function OnboardingTour({ open, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const steps = useMemo(() => TOUR_STEPS, []);
  const step = steps[stepIndex];

  const closeTour = useCallback(() => {
    setStepIndex(0);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open || !step) return undefined;

    const syncTargetRect = () => {
      const target = document.querySelector(step.selector);
      if (!target) {
        setTargetRect(null);
        return;
      }

      setTargetRect(target.getBoundingClientRect());
    };

    const moveToTarget = () => {
      const target = document.querySelector(step.selector);
      if (!target) {
        setTargetRect(null);
        return;
      }

      target.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
      window.setTimeout(syncTargetRect, 180);
    };

    moveToTarget();
    window.addEventListener('resize', syncTargetRect);
    window.addEventListener('scroll', syncTargetRect, true);

    return () => {
      window.removeEventListener('resize', syncTargetRect);
      window.removeEventListener('scroll', syncTargetRect, true);
    };
  }, [open, step]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeTour();
      if (event.key === 'ArrowRight') setStepIndex((current) => Math.min(current + 1, steps.length - 1));
      if (event.key === 'ArrowLeft') setStepIndex((current) => Math.max(current - 1, 0));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeTour, open, steps.length]);

  if (!open || !step) return null;

  const fallbackRect = {
    top: 96,
    left: 24,
    width: Math.max(240, window.innerWidth - 48),
    height: 120,
    bottom: 216,
    right: window.innerWidth - 24,
  };
  const rect = targetRect || fallbackRect;
  const highlightStyle = {
    top: Math.max(8, rect.top - 8),
    left: Math.max(8, rect.left - 8),
    width: Math.min(window.innerWidth - 16, rect.width + 16),
    height: rect.height + 16,
    backdropFilter: 'brightness(1.45) saturate(1.18)',
    WebkitBackdropFilter: 'brightness(1.45) saturate(1.18)',
  };
  const popoverStyle = getPopoverPosition(rect);
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div
        className="absolute rounded-xl border-2 border-accent-soft bg-accent-soft/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.62),4px_4px_0_0_#000000,0_0_0_4px_rgba(193,237,210,0.55)] transition-all duration-200"
        style={highlightStyle}
      />
      <section
        className="pointer-events-auto fixed rounded-lg border-2 border-border bg-bg-surface p-4 shadow-card"
        style={popoverStyle}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-accent-secondary">
              Langkah {stepIndex + 1} / {steps.length}
            </p>
            <h2 id="tour-title" className="mt-1 text-lg font-bold leading-snug text-text-primary">
              {step.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeTour}
            className="focus-ring rounded-md p-1.5 text-text-muted hover:bg-bg-elevated hover:text-text-primary"
            aria-label="Tutup tour guide"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{step.body}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
            disabled={isFirst}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border-2 border-border px-3 py-2 text-sm font-bold text-text-secondary hover:bg-bg-elevated hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <button
            type="button"
            onClick={() => (isLast ? closeTour() : setStepIndex((current) => current + 1))}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border-2 border-border bg-accent-primary px-3 py-2 text-sm font-bold text-white shadow-card hover:bg-accent-secondary"
          >
            {isLast ? 'Selesai' : 'Next'}
            {!isLast && <ChevronRight size={16} />}
          </button>
        </div>
      </section>
    </div>
  );
}
