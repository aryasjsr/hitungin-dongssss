export default function DPSelector({ selectedP, onPChange }) {
  return (
    <div>
        <label htmlFor="persentil-selector" className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-1.5">
          Persentil Terpilih (Pk)
        </label>
        <input
          id="persentil-selector"
          type="number"
          min={1}
          max={99}
          step={1}
          value={selectedP}
          onChange={(e) => {
            const v = Math.max(1, Math.min(99, Number(e.target.value)));
            onPChange(v);
          }}
          className="focus-ring w-full bg-bg-elevated border border-border rounded-sm text-text-primary font-mono text-sm p-2.5 outline-none transition-colors duration-150 focus:border-accent-primary focus:shadow-[4px_4px_0_0_#8ab49c]"
        />
        <p className="mt-1.5 text-xs text-text-muted">
          Pk dipakai untuk mencari batas nilai tempat k% data berada di bawah atau sama dengan nilai tersebut.
        </p>
    </div>
  );
}
