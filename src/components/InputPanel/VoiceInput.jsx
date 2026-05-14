import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Mic, MicOff, Plus } from 'lucide-react';
import { parseSpeechNumbers } from '../../utils/speechNumbers';
import { formatNumber } from '../../utils/formatters';
import toast from 'react-hot-toast';

const SpeechRecognitionApi = () => window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceInput({ onAppendValues, toggleSignal = 0 }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const handledToggleSignalRef = useRef(0);
  const manualStopRef = useRef(false);
  const supported = typeof window !== 'undefined' && Boolean(SpeechRecognitionApi());
  const parsed = useMemo(() => parseSpeechNumbers(transcript), [transcript]);

  const stopListening = useCallback(() => {
    manualStopRef.current = true;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  const appendParsedText = useCallback((text) => {
    const nextParsed = parseSpeechNumbers(text);
    if (nextParsed.values.length > 0) {
      onAppendValues(nextParsed.values);
      toast.success(`${nextParsed.values.length} angka otomatis masuk ke data mentah.`);
    }
    return nextParsed;
  }, [onAppendValues]);

  const toggleListening = useCallback(() => {
    if (!supported) {
      toast.error('Browser ini belum mendukung voice input.');
      return;
    }

    if (listening) {
      stopListening();
      return;
    }

    const Recognition = SpeechRecognitionApi();
    const recognition = new Recognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;
    manualStopRef.current = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
      manualStopRef.current = false;
    };
    recognition.onerror = (event) => {
      setListening(false);
      if (manualStopRef.current || event.error === 'aborted' || event.error === 'no-speech') {
        return;
      }
      toast.error(event.error === 'not-allowed' ? 'Izin mikrofon ditolak.' : 'Voice input gagal.');
    };
    recognition.onresult = (event) => {
      const allText = Array.from(event.results)
        .map(result => result[0]?.transcript || '')
        .join(' ')
        .trim();
      setTranscript(allText);

      const finalText = Array.from(event.results)
        .slice(event.resultIndex)
        .filter(result => result.isFinal)
        .map(result => result[0]?.transcript || '')
        .join(' ')
        .trim();

      if (finalText) {
        appendParsedText(finalText);
      }
    };

    recognition.start();
  }, [appendParsedText, listening, stopListening, supported]);

  useEffect(() => {
    if (toggleSignal === 0) return;
    if (handledToggleSignalRef.current === toggleSignal) return;
    handledToggleSignalRef.current = toggleSignal;
    const timer = window.setTimeout(() => toggleListening(), 0);
    return () => window.clearTimeout(timer);
  }, [toggleSignal, toggleListening]);

  useEffect(() => () => stopListening(), [stopListening]);

  const handleAppend = () => {
    if (parsed.values.length === 0) {
      toast.error('Tidak ada angka valid dari transcript.');
      return;
    }
    appendParsedText(transcript);
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-text-secondary">Voice Input</h3>
        <p className="text-xs text-text-muted">Space untuk on/off, Q untuk hapus angka terakhir.</p>
      </div>

        <button
          type="button"
          onClick={toggleListening}
          disabled={!supported}
          className="focus-ring inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-border rounded-md text-text-primary hover:bg-bg-elevated disabled:opacity-45 disabled:cursor-not-allowed"
        >
          {listening ? <MicOff size={14} /> : <Mic size={14} />}
          {listening ? 'Stop' : 'Rekam Otomatis'}
        </button>

        {!supported && (
          <p className="rounded-md border border-brand-warning/30 bg-brand-warning/10 p-2 text-xs text-brand-warning">
            Voice input tidak tersedia di browser ini.
          </p>
        )}

        <label htmlFor="voice-transcript" className="sr-only">Transcript voice input</label>
        <textarea
          id="voice-transcript"
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          rows={2}
          placeholder="Transcript akan muncul di sini. Koma dipakai untuk desimal, contoh: lima puluh koma lima."
          className="focus-ring w-full bg-bg-elevated border border-border rounded-sm text-text-primary text-xs p-2.5 resize-y placeholder:text-text-muted outline-none"
        />

        {transcript && (
          <div className="rounded-md border border-border-subtle bg-bg-elevated/50 p-2 text-xs text-text-muted space-y-1">
            {parsed.values.length > 0 && <p>Angka: {parsed.values.map(value => formatNumber(value)).join(', ')}</p>}
            {parsed.invalidTokens.length > 0 && (
              <p className="text-brand-warning">Tidak terbaca: {parsed.invalidTokens.join(', ')}</p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleAppend}
          disabled={parsed.values.length === 0}
          className="focus-ring w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-bg-elevated border border-border text-text-primary rounded-md hover:border-accent-primary disabled:opacity-45 disabled:cursor-not-allowed"
        >
          <Plus size={15} />
          Tambahkan Lagi
        </button>
    </div>
  );
}
