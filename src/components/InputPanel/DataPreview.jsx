import { AlertTriangle, CircleAlert } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export default function DataPreview({ parsedCount, invalidTokens, warnings, errors, values = [] }) {
  const previewValues = values.slice(0, 12);
  const remainingCount = Math.max(values.length - previewValues.length, 0);

  return (
    <div className="space-y-2">
      {/* Data count */}
      {parsedCount > 0 && (
        <div className="rounded-md border border-border-subtle bg-bg-elevated/45 p-2.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Data valid:</span>
            <span className="font-mono font-bold text-accent-secondary">{parsedCount}</span>
          </div>
          {previewValues.length > 0 && (
            <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
              Preview:{' '}
              <span className="font-mono text-text-secondary">
                {previewValues.map(value => formatNumber(value)).join(', ')}
                {remainingCount > 0 ? `, +${remainingCount} lagi` : ''}
              </span>
            </p>
          )}
        </div>
      )}

      {/* Errors */}
      {errors && errors.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-md text-sm" style={{ background: 'rgba(239, 68, 68, 0.15)', borderLeft: '3px solid #ef4444' }}>
          <CircleAlert size={16} className="text-brand-error flex-shrink-0 mt-0.5" />
          <div>
            {errors.map((err, i) => (
              <p key={i} className="text-text-primary">{err}</p>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-md text-sm" style={{ background: 'rgba(245, 158, 11, 0.15)', borderLeft: '3px solid #f59e0b' }}>
          <AlertTriangle size={16} className="text-brand-warning flex-shrink-0 mt-0.5" />
          <div>
            {warnings.map((warn, i) => (
              <p key={i} className="text-text-primary">{warn}</p>
            ))}
          </div>
        </div>
      )}

      {/* Invalid tokens as chips */}
      {invalidTokens && invalidTokens.length > 0 && (
        <div>
          <p className="text-xs text-text-muted mb-1.5">Token tidak valid:</p>
          <div className="flex flex-wrap gap-1.5">
            {invalidTokens.map((token, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-1 text-xs font-mono bg-bg-overlay border border-brand-error/30 text-brand-error rounded-sm"
              >
                {token}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
