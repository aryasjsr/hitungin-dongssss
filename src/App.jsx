import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import AppHeader from './components/AppHeader';
import DesktopLayout from './components/Layout/DesktopLayout';
import MobileLayout from './components/Layout/MobileLayout';
import BottomTabs from './components/Layout/BottomTabs';
import OnboardingTour from './components/OnboardingTour';
import InputModeSelector from './components/InputPanel/InputModeSelector';
import RawDataInput from './components/InputPanel/RawDataInput';
import FrequencyTableInput from './components/InputPanel/FrequencyTableInput';
import GroupedDataInput from './components/InputPanel/GroupedDataInput';
import DataPreview from './components/InputPanel/DataPreview';
import DPSelector from './components/InputPanel/DPSelector';
import CsvImport from './components/InputPanel/CsvImport';
import VoiceInput from './components/InputPanel/VoiceInput';
import AnalyzeButton from './components/InputPanel/AnalyzeButton';
import DataTable from './components/OutputPanel/DataTable';
import ParameterCards from './components/OutputPanel/ParameterCards';
import FrequencyChart from './components/OutputPanel/FrequencyChart';
import { PARAMETER_ITEMS } from './constants/parameterConfig';
import ExportExcel from './components/Export/ExportExcel';
import ExportPNG from './components/Export/ExportPNG';
import ExportPDF from './components/Export/ExportPDF';
import FormulaGuidelinesPage from './pages/FormulaGuidelinesPage';
import { useParser } from './hooks/useParser';
import { useStatCalc } from './hooks/useStatCalc';
import { useSession } from './hooks/useSession';
import { parseRawInput } from './utils/dataParser';
import { validateDataCount, validateFi, validateIntervalFormat } from './utils/validators';
import { buildClassIntervals } from './utils/classBuilder';
import { BarChart3, ChevronDown, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_VISIBLE_PARAMETERS = ['mean', 'median', 'q1', 'q2', 'q3', 'pk', 'variance', 'standar Deviation', 'n'];
const TOUR_SEEN_KEY = 'hitunginlab-tour-seen';
const INPUT_TABS = [
  { key: 'manual', label: 'Manual' },
  { key: 'csv', label: 'CSV' },
  { key: 'voice', label: 'Voice' },
];

export default function App() {
  // --- Input state ---
  const [inputMode, setInputMode] = useState('raw');
  const [rawText, setRawText] = useState('');
  const [xiRows, setXiRows] = useState([{ xi: '', fi: '' }, { xi: '', fi: '' }]);
  const [groupedRows, setGroupedRows] = useState([{ classInterval: '', fi: '' }, { classInterval: '', fi: '' }]);
  const [autoClass, setAutoClass] = useState(true);
  const [rawTextForAuto, setRawTextForAuto] = useState('');
  const [selectedP, setSelectedP] = useState(50);
  const [activeInputPanel, setActiveInputPanel] = useState('manual');

  // --- Output state ---
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [activeChartType, setActiveChartType] = useState('bar');
  const [activeResultTab, setActiveResultTab] = useState('analysis');
  const [visibleParameterKeys, setVisibleParameterKeys] = useState(DEFAULT_VISIBLE_PARAMETERS);
  const [voiceToggleSignal, setVoiceToggleSignal] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [sessionLoadVersion, setSessionLoadVersion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState('calculator');
  const [showTour, setShowTour] = useState(false);
  const [parameterPanelOpen, setParameterPanelOpen] = useState(true);
  const chartRef = useRef(null);
  const handledSessionLoadRef = useRef(0);

  // --- Parser ---
  const parser = useParser();
  const { parseInput } = parser;

  // --- Parse raw text on change ---
  const handleRawTextChange = useCallback((text) => {
    setRawText(text);
    parseInput(text);
  }, [parseInput]);

  // --- Auto-class raw text ---
  const generatedRows = useMemo(() => {
    if (!autoClass || !rawTextForAuto) return [];
    const { values } = parseRawInput(rawTextForAuto);
    if (values.length < 2) return [];
    const sorted = [...values].sort((a, b) => a - b);
    return buildClassIntervals(sorted);
  }, [autoClass, rawTextForAuto]);

  // --- Session ---
  const session = useSession({
    inputMode, rawText, xiRows, groupedRows, selectedP, autoClass, rawTextForAuto,
    setInputMode, setRawText: handleRawTextChange, setXiRows, setGroupedRows, setSelectedP, setAutoClass, setRawTextForAuto,
    onLoadComplete: () => setSessionLoadVersion(version => version + 1),
  });

  // --- Stat calculator ---
  const statCalc = useStatCalc({
    inputMode,
    rawData: parser.parsedData,
    xiRows: xiRows.filter(r => r.xi !== '' && r.fi !== '').map(r => ({ xi: Number(r.xi), fi: Number(r.fi) })),
    groupedRows: autoClass ? generatedRows : groupedRows.filter(r => r.classInterval && r.fi !== '').map(r => {
      const parsed = validateIntervalFormat(r.classInterval);
      if (parsed.error) return null;
      return {
        classInterval: r.classInterval,
        lower: parsed.lower,
        upper: parsed.upper,
        lowerBoundary: parsed.lower - 0.5,
        upperBoundary: parsed.upper + 0.5,
        xi: (parsed.lower + parsed.upper) / 2,
        fi: Number(r.fi),
      };
    }).filter(Boolean),
    selectedP,
  });

  const applyCsvRaw = useCallback((text) => {
    setInputMode('raw');
    setActiveInputPanel('manual');
    handleRawTextChange(text);
    setResults(null);
    setActiveTab('input');
  }, [handleRawTextChange]);

  const applyCsvFrequency = useCallback((rows) => {
    setInputMode('frequency');
    setActiveInputPanel('manual');
    setXiRows(rows.length > 0 ? rows : [{ xi: '', fi: '' }]);
    setResults(null);
    setActiveTab('input');
  }, []);

  const appendVoiceValues = useCallback((values) => {
    const addition = values.join(', ');
    setInputMode('raw');
    setRawText((current) => {
      const next = current.trim() ? `${current.trim()}, ${addition}` : addition;
      parseInput(next);
      return next;
    });
    setResults(null);
    setActiveTab('input');
  }, [parseInput]);

  const removeLastRawValue = useCallback(() => {
    setInputMode('raw');
    setRawText((current) => {
      const trimmed = current.trim();
      if (!trimmed) {
        toast.error('Data mentah masih kosong.');
        return current;
      }

      const next = trimmed
        .replace(/(?:[,;\s]+)?-?\d+(?:[.,]\d+)?\s*$/, '')
        .replace(/[,;\s]+$/, '');
      parseInput(next);
      toast.success('Angka terakhir dihapus.');
      return next;
    });
    setResults(null);
  }, [parseInput]);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(TOUR_SEEN_KEY)) return;
      window.localStorage.setItem(TOUR_SEEN_KEY, 'true');
      window.setTimeout(() => setShowTour(true), 350);
    } catch {
      window.setTimeout(() => setShowTour(true), 350);
    }
  }, []);

  const handleStartTour = useCallback(() => {
    setActivePage('calculator');
    setActiveTab('input');
    setActiveInputPanel('manual');
    window.setTimeout(() => setShowTour(true), 80);
  }, []);

  const handleGuidelinesToggle = useCallback(() => {
    setShowTour(false);
    setActivePage((page) => (page === 'guidelines' ? 'calculator' : 'guidelines'));
  }, []);

  useEffect(() => {
    const handleShortcut = (event) => {
      const target = event.target;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if (isTyping || event.ctrlKey || event.altKey || event.metaKey) return;

      if (event.code === 'Space') {
        event.preventDefault();
        setActiveTab('input');
        setActiveInputPanel('voice');
        setVoiceToggleSignal(signal => signal + 1);
      } else if (event.key?.toLowerCase() === 'q') {
        event.preventDefault();
        removeLastRawValue();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [removeLastRawValue]);

  // --- Analyze ---
  const handleAnalyze = useCallback(() => {
    session.saveDraft();
    setLoading(true);
    // Use setTimeout to allow UI to update with loading state
    setTimeout(() => {
      try {
        // Validate based on input mode
        if (inputMode === 'raw') {
          const { values } = parseRawInput(rawText);
          const validation = validateDataCount(values.length);
          if (!validation.valid) {
            toast.error(validation.error);
            setLoading(false);
            return;
          }
        } else if (inputMode === 'frequency') {
          const validRows = xiRows.filter(r => r.xi !== '' && r.fi !== '');
          if (validRows.length < 1) {
            toast.error('Masukkan minimal 1 baris xi/fi yang valid.');
            setLoading(false);
            return;
          }
          const invalidFi = validRows.some(r => !validateFi(r.fi));
          if (invalidFi) {
            toast.error('Frekuensi harus berupa bilangan bulat positif (≥ 1).');
            setLoading(false);
            return;
          }
          const totalFi = validRows.reduce((sum, r) => sum + Number(r.fi), 0);
          const validation = validateDataCount(totalFi);
          if (!validation.valid) {
            toast.error(validation.error);
            setLoading(false);
            return;
          }
        } else if (inputMode === 'grouped') {
          if (autoClass) {
            if (generatedRows.length < 1) {
              toast.error('Data mentah tidak cukup untuk membuat kelas interval.');
              setLoading(false);
              return;
            }
          } else {
            const validRows = groupedRows.filter(r => r.classInterval && r.fi !== '');
            if (validRows.length < 1) {
              toast.error('Masukkan minimal 1 interval kelas yang valid.');
              setLoading(false);
              return;
            }
            for (const r of validRows) {
              const parsed = validateIntervalFormat(r.classInterval);
              if (parsed.error) {
                toast.error(parsed.error);
                setLoading(false);
                return;
              }
              if (!validateFi(r.fi)) {
                toast.error('Frekuensi harus berupa bilangan bulat positif (≥ 1).');
                setLoading(false);
                return;
              }
            }
          }
        }

        const result = statCalc.calculate();
        if (result) {
          setResults(result);
          setActiveTab('analysis');
          setActiveResultTab('analysis');
          toast.success('Analisis selesai!');
        } else {
          toast.error('Gagal menghitung statistik. Periksa data input Anda.');
        }
      } catch (err) {
        toast.error('Terjadi kesalahan saat analisis.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 50);
  }, [inputMode, rawText, xiRows, groupedRows, autoClass, generatedRows, statCalc, session]);

  useEffect(() => {
    if (sessionLoadVersion === 0 || handledSessionLoadRef.current === sessionLoadVersion) return;
    handledSessionLoadRef.current = sessionLoadVersion;
    handleAnalyze();
  }, [sessionLoadVersion, handleAnalyze]);

  // --- Check if analysis is possible ---
  const canAnalyze = useMemo(() => {
    if (inputMode === 'raw') {
      return parser.isValid && parser.parsedData.length >= 2;
    } else if (inputMode === 'frequency') {
      const validRows = xiRows.filter(r => r.xi !== '' && r.fi !== '');
      return validRows.length >= 1 && validRows.every(r => validateFi(r.fi));
    } else if (inputMode === 'grouped') {
      if (autoClass) {
        return generatedRows.length >= 1;
      }
      const validRows = groupedRows.filter(r => r.classInterval && r.fi !== '');
      return validRows.length >= 1;
    }
    return false;
  }, [inputMode, parser.isValid, parser.parsedData, xiRows, groupedRows, autoClass, generatedRows]);

  // --- Reset ---
  const handleReset = useCallback(() => {
    setRawText('');
    setXiRows([{ xi: '', fi: '' }, { xi: '', fi: '' }]);
    setGroupedRows([{ classInterval: '', fi: '' }, { classInterval: '', fi: '' }]);
    setAutoClass(true);
    setRawTextForAuto('');
    setSelectedP(50);
    setResults(null);
    setActiveTab('input');
    setActiveChartType('bar');
    setActiveResultTab('analysis');
    setActiveInputPanel('manual');
    setVisibleParameterKeys(DEFAULT_VISIBLE_PARAMETERS);
    setResetKey(key => key + 1);
    parser.reset();
    session.clearDraft();
    toast.success('Data telah direset.');
  }, [parser, session]);

  // --- Handle mobile tab change ---
  const handleMobileTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'table') setActiveResultTab('table');
    if (tab === 'analysis') setActiveResultTab('analysis');
  }, []);

  const toggleParameter = useCallback((key) => {
    setVisibleParameterKeys((current) => {
      if (current.includes(key)) {
        return current.filter(item => item !== key);
      }
      return [...current, key];
    });
  }, []);

  // --- Input Panel ---
  const inputPanel = (
    <section
      className="w-full space-y-5 overflow-hidden rounded-lg border-2 border-border bg-accent-soft p-5 shadow-card transition-all duration-200 hover-glow"
      style={{ maxWidth: 'calc(100vw - 32px)' }}
    >
      <div>
        <p className="text-sm font-bold uppercase text-text-secondary">Data Input</p>
        <h2 className="mt-1 text-3xl font-bold leading-tight text-text-primary">Workspace</h2>
      </div>

      <div className="flex max-w-full gap-2 overflow-hidden rounded-full border-2 border-border bg-bg-surface p-1.5" role="tablist" aria-label="Metode input" data-tour="input-method">
        {INPUT_TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeInputPanel === tab.key}
            data-tour={`input-tab-${tab.key}`}
            onClick={() => setActiveInputPanel(tab.key)}
            className={`focus-ring interactive-press min-w-0 flex-1 rounded-full border-2 px-2 py-2 text-xs font-bold leading-tight transition-transform duration-150 sm:px-3 sm:text-sm ${
              activeInputPanel === tab.key
                ? 'border-border bg-accent-primary text-white shadow-card'
                : 'border-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeInputPanel === 'manual' && (
        <div className="space-y-4" data-tour="data-entry">
          <InputModeSelector inputMode={inputMode} onModeChange={setInputMode} />

          {inputMode === 'raw' && (
            <RawDataInput value={rawText} onChange={handleRawTextChange} />
          )}

          {inputMode === 'frequency' && (
            <FrequencyTableInput xiRows={xiRows} onChange={setXiRows} />
          )}

          {inputMode === 'grouped' && (
            <GroupedDataInput
              groupedRows={groupedRows}
              onChange={setGroupedRows}
              autoClass={autoClass}
              onAutoClassChange={setAutoClass}
              rawTextForAuto={rawTextForAuto}
              onRawTextForAutoChange={setRawTextForAuto}
              generatedRows={generatedRows}
            />
          )}

          {inputMode === 'raw' && (
            <DataPreview
              parsedCount={parser.parsedData.length}
              values={parser.parsedData}
              invalidTokens={parser.invalidTokens}
              warnings={parser.warnings}
              errors={parser.errors}
            />
          )}
        </div>
      )}

      {activeInputPanel === 'csv' && (
        <CsvImport key={`csv-${resetKey}`} onApplyRaw={applyCsvRaw} onApplyFrequency={applyCsvFrequency} />
      )}

      {activeInputPanel === 'voice' && (
        <div className="space-y-4">
          <VoiceInput
            key={`voice-${resetKey}`}
            onAppendValues={appendVoiceValues}
            toggleSignal={voiceToggleSignal}
          />
          <RawDataInput value={rawText} onChange={handleRawTextChange} />
          <DataPreview
            parsedCount={parser.parsedData.length}
            values={parser.parsedData}
            invalidTokens={parser.invalidTokens}
            warnings={parser.warnings}
            errors={parser.errors}
          />
        </div>
      )}

      <div data-tour="percentile">
        <DPSelector
          selectedP={selectedP}
          onPChange={setSelectedP}
        />
      </div>

      <div data-tour="analyze">
        <AnalyzeButton onClick={handleAnalyze} disabled={!canAnalyze} loading={loading} />
      </div>

      <button
        onClick={handleReset}
        className="focus-ring interactive-press flex w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-bg-surface py-2 text-sm font-bold text-brand-error shadow-card transition-transform duration-150 hover:bg-bg-elevated"
      >
        <RefreshCw size={14} />
        Reset
      </button>
    </section>
  );

  // --- Output Panel ---
  const outputPanel = (
    <section
      className="min-h-[520px] w-full overflow-hidden rounded-lg border-2 border-border bg-bg-surface p-5 shadow-card transition-all duration-200 hover-glow xl:p-6"
      style={{ maxWidth: 'calc(100vw - 32px)' }}
      data-tour="output"
    >
      {!results ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-accent-soft shadow-card">
            <BarChart3 size={42} className="text-text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary">Overview Analysis</h2>
          <p className="mt-2 max-w-md text-base text-text-secondary">
            Masukkan data terlebih dahulu untuk mulai analisis.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-4xl font-bold leading-tight text-text-primary">Report Analisis</h2>
              <p className="mt-1 text-base text-text-secondary">Parameter, grafik, dan tabel distribusi dalam panel kerja.</p>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <ExportExcel results={results} chartType={activeChartType} />
              <ExportPNG chartRef={chartRef} />
              <ExportPDF results={results} chartType={activeChartType} />
            </div>
          </div>

          {/* Mobile export buttons */}
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <ExportExcel results={results} chartType={activeChartType} />
            <ExportPNG chartRef={chartRef} />
            <ExportPDF results={results} chartType={activeChartType} />
          </div>

          <div className="mb-5 inline-flex rounded-full border-2 border-border bg-bg-elevated p-1.5" role="tablist" aria-label="Output">
            {[
              { key: 'analysis', label: 'Grafik' },
              { key: 'table', label: 'Tabel' },
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeResultTab === tab.key}
                onClick={() => setActiveResultTab(tab.key)}
                className={`focus-ring interactive-press rounded-full border-2 px-4 py-2 text-sm font-bold transition-transform ${
                  activeResultTab === tab.key
                    ? 'border-border bg-accent-primary text-white shadow-card'
                    : 'border-transparent text-text-secondary hover:bg-bg-surface hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeResultTab === 'analysis' && (
            <div className="space-y-3">
              <div className={`grid gap-3 transition-all duration-200 ${
                parameterPanelOpen
                  ? 'xl:grid-cols-[minmax(0,1fr)_260px]'
                  : 'xl:grid-cols-[minmax(0,1fr)_64px]'
              }`}>
                <FrequencyChart
                  results={results}
                  chartRef={chartRef}
                  chartType={activeChartType}
                  onChartTypeChange={setActiveChartType}
                  visibleKeys={visibleParameterKeys}
                />

                <aside className={`rounded-lg border-2 border-border bg-accent-primary text-white shadow-card transition-all duration-200 ${
                  parameterPanelOpen ? 'p-0' : 'min-h-[390px] p-2'
                }`}>
                  <div className={`flex gap-2 ${parameterPanelOpen ? 'flex-col p-4' : 'h-full flex-col items-center justify-center'}`}>
                    <button
                      type="button"
                      onClick={() => setParameterPanelOpen(open => !open)}
                      className={`focus-ring flex min-w-0 items-center gap-2 text-left ${
                        parameterPanelOpen ? '' : 'flex-col'
                      }`}
                      aria-expanded={parameterPanelOpen}
                      aria-controls="parameter-visibility-panel"
                      aria-label={parameterPanelOpen ? 'Tutup panel parameter tampil' : 'Buka panel parameter tampil'}
                    >
                      <ChevronDown
                        size={18}
                        className={`shrink-0 transition-transform ${
                          parameterPanelOpen ? 'rotate-90' : '-rotate-90'
                        }`}
                      />
                      <span
                        className={`font-bold text-white ${parameterPanelOpen ? 'text-xl' : 'text-sm'}`}
                        style={parameterPanelOpen ? undefined : { writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                      >
                        Parameter Tampil
                      </span>
                    </button>
                    {parameterPanelOpen && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setVisibleParameterKeys(PARAMETER_ITEMS.map(item => item.key))}
                          className="focus-ring interactive-press rounded-full border border-white bg-accent-soft px-3 py-1.5 text-xs font-bold text-text-primary"
                        >
                          Semua
                        </button>
                        <button
                          type="button"
                          onClick={() => setVisibleParameterKeys([])}
                          className="focus-ring interactive-press rounded-full border border-white bg-transparent px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10"
                        >
                          Kosongkan
                        </button>
                      </div>
                    )}
                  </div>
                  {parameterPanelOpen && (
                    <div id="parameter-visibility-panel" className="border-t border-white/30 p-4 pt-3">
                      <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-1">
                        {PARAMETER_ITEMS.map(item => (
                          <label key={item.key} className="flex items-center gap-2 rounded-full border border-white/25 px-2 py-1.5 text-xs font-bold text-white hover:bg-white/10">
                            <input
                              type="checkbox"
                              checked={visibleParameterKeys.includes(item.key)}
                              onChange={() => toggleParameter(item.key)}
                              className="h-4 w-4 accent-accent-primary"
                            />
                            <span>{item.key === 'pk' ? `P${results.selectedP}` : item.label}</span>
                          </label>
                        ))}
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-white/70">
                        Pk adalah persentil terpilih: batas nilai tempat P persen data berada di bawah atau sama dengan nilai itu.
                      </p>
                    </div>
                  )}
                </aside>
              </div>

              <ParameterCards results={results} visibleKeys={visibleParameterKeys} />
            </div>
          )}

          {activeResultTab === 'table' && <DataTable results={results} />}
        </>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-bg-base">
      <AppHeader
        onSave={session.saveSession}
        onLoad={session.loadSession}
        onStartTour={handleStartTour}
        onOpenGuidelines={handleGuidelinesToggle}
        activePage={activePage}
      />
      {activePage === 'guidelines' ? (
        <FormulaGuidelinesPage onBack={() => setActivePage('calculator')} />
      ) : (
        <>
          <DesktopLayout inputPanel={inputPanel} outputPanel={outputPanel} />
          <MobileLayout activeTab={activeTab} inputPanel={inputPanel} outputPanel={outputPanel} />
          <BottomTabs activeTab={activeTab} onTabChange={handleMobileTabChange} />
        </>
      )}
      <OnboardingTour open={showTour && activePage === 'calculator'} onClose={() => setShowTour(false)} />
    </div>
  );
}
