export default function RawDataInput({ value, onChange }) {
  return (
    <div>
      <label htmlFor="raw-data-input" className="block text-sm font-medium text-text-secondary mb-2">
        Data Mentah
      </label>
      <textarea
        id="raw-data-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Contoh: 56, 76, 45, 89, 67"
        rows={4}
        className="focus-ring w-full bg-bg-elevated border border-border rounded-sm text-text-primary font-mono text-sm p-2.5 resize-y placeholder:text-text-muted transition-colors duration-150 focus:border-accent-primary focus:shadow-[4px_4px_0_0_#8ab49c] outline-none"
        style={{ minHeight: '96px' }}
        aria-describedby="raw-data-help"
      />
      <p id="raw-data-help" className="mt-1.5 text-xs text-text-muted">
        Pisahkan dengan koma, spasi, titik koma, atau baris baru.
      </p>
    </div>
  );
}
