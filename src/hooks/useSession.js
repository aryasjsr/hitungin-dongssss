import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const DRAFT_KEY = 'hitungindong-draft';
const SESSION_VERSION = '1.0';

/**
 * Hook for session save/load and auto-persistence to localStorage.
 */
export function useSession({
  inputMode,
  rawText,
  xiRows,
  groupedRows,
  selectedP,
  autoClass,
  rawTextForAuto,
  setInputMode,
  setRawText,
  setXiRows,
  setGroupedRows,
  setSelectedP,
  setAutoClass,
  setRawTextForAuto,
  onLoadComplete,
}) {
  const [isDraftHydrated, setIsDraftHydrated] = useState(false);

  // --- Auto-persistence: save draft on every change ---
  useEffect(() => {
    if (!isDraftHydrated) return;
    const draft = { inputMode, rawText, xiRows, groupedRows, selectedP, autoClass, rawTextForAuto };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Silently ignore quota errors
    }
  }, [isDraftHydrated, inputMode, rawText, xiRows, groupedRows, selectedP, autoClass, rawTextForAuto]);

  const saveDraft = useCallback(() => {
    const draft = { inputMode, rawText, xiRows, groupedRows, selectedP, autoClass, rawTextForAuto };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Silently ignore quota errors
    }
  }, [inputMode, rawText, xiRows, groupedRows, selectedP, autoClass, rawTextForAuto]);

  // --- Restore draft on mount ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.inputMode) setInputMode(draft.inputMode);
        if (draft.rawText !== undefined) setRawText(draft.rawText);
        if (draft.xiRows) setXiRows(draft.xiRows);
        if (draft.groupedRows) setGroupedRows(draft.groupedRows);
        if (draft.selectedP !== undefined) setSelectedP(draft.selectedP);
        if (draft.autoClass !== undefined) setAutoClass(draft.autoClass);
        if (draft.rawTextForAuto !== undefined) setRawTextForAuto(draft.rawTextForAuto);
      }
    } catch {
      // Ignore parse errors
    } finally {
      setIsDraftHydrated(true);
    }
  }, [setAutoClass, setGroupedRows, setInputMode, setRawText, setRawTextForAuto, setSelectedP, setXiRows]);

  // --- Save session to .json file ---
  const saveSession = useCallback(() => {
    const dataType = inputMode === 'raw' ? 'tunggal' : inputMode === 'frequency' ? 'berbobot' : 'kelompok';
    const session = {
      version: SESSION_VERSION,
      createdAt: new Date().toISOString(),
      inputMode,
      dataType,
      rawData: inputMode === 'raw' ? rawText.split(/[,;\s\n\r\t]+/).map(Number).filter(n => !isNaN(n)) : [],
      xiRows: inputMode === 'frequency' ? xiRows : [],
      groupedRows: inputMode === 'grouped' ? groupedRows : [],
      rawTextForAuto: inputMode === 'grouped' && autoClass ? rawTextForAuto : '',
      selectedP,
      autoClass,
    };

    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HitunginDong-session.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Session berhasil disimpan!');
  }, [inputMode, rawText, xiRows, groupedRows, selectedP, autoClass, rawTextForAuto]);

  // --- Load session from .json file ---
  const loadSession = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const session = JSON.parse(ev.target.result);

          // Validate version
          if (session.version !== SESSION_VERSION) {
            toast.error(`File session tidak valid atau versi tidak didukung (v${session.version || '?'}).`);
            return;
          }

          const validModes = ['raw', 'frequency', 'grouped'];
          if (!validModes.includes(session.inputMode)) {
            toast.error('File session memiliki mode input tidak valid.');
            return;
          }
          if (session.results !== undefined) {
            toast.error('File session tidak valid: results tidak boleh disimpan.');
            return;
          }

          // Restore state; results are recalculated by the analysis flow, not read from file.
          setInputMode(session.inputMode);
          if (session.rawData && session.inputMode === 'raw') {
            setRawText(session.rawData.join(', '));
          } else if (session.rawText && session.inputMode === 'raw') {
            setRawText(session.rawText);
          }
          if (Array.isArray(session.xiRows)) setXiRows(session.xiRows);
          if (Array.isArray(session.groupedRows)) setGroupedRows(session.groupedRows);
          if (session.selectedP !== undefined) setSelectedP(session.selectedP);
          if (session.autoClass !== undefined) setAutoClass(session.autoClass);
          if (session.rawTextForAuto !== undefined) setRawTextForAuto(session.rawTextForAuto);

          onLoadComplete?.();
          toast.success('Session berhasil dimuat. Hasil dihitung ulang.');
        } catch {
          toast.error('File session tidak valid atau rusak.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setInputMode, setRawText, setXiRows, setGroupedRows, setSelectedP, setAutoClass, setRawTextForAuto, onLoadComplete]);

  // --- Clear draft ---
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { saveSession, loadSession, clearDraft, saveDraft };
}
