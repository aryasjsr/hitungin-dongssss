import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Bar, Line } from 'react-chartjs-2';
import { RotateCcw } from 'lucide-react';
import { CHART_COLORS, CHART_ANIMATION_DURATION, CHART_FONT, MARKER_COLORS } from '../../constants/chartConfig';
import { formatNumber, formatMode } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin,
  zoomPlugin,
);

const CHART_TYPES = [
  { key: 'bar', label: 'Bar' },
  { key: 'polygon', label: 'Poligon' },
  { key: 'ogive', label: 'Ogive' },
];

function getMarkers(results, visibleKeys) {
  const visibleSet = Array.isArray(visibleKeys) ? new Set(visibleKeys) : null;
  const markers = [
    { key: 'mean', label: 'Mean', value: results.mean, color: MARKER_COLORS.mean },
    { key: 'median', label: 'Median', value: results.median, color: MARKER_COLORS.median },
    { key: 'q1', label: 'Q1', value: results.q1, color: MARKER_COLORS.q1 },
    { key: 'q2', label: 'Q2', value: results.q2, color: MARKER_COLORS.q2 },
    { key: 'q3', label: 'Q3', value: results.q3, color: MARKER_COLORS.q3 },
    { key: 'pk', label: `P${results.selectedP}`, value: results.pk, color: MARKER_COLORS.pk },
  ];

  const modeValue = Array.isArray(results.mode) && results.mode.length > 0 ? results.mode[0] : null;
  if (modeValue !== null) {
    markers.splice(2, 0, { key: 'mode', label: 'Modus', value: modeValue, color: MARKER_COLORS.mode });
  }

  return markers
    .filter(marker => Number.isFinite(marker.value))
    .filter(marker => !visibleSet || visibleSet.has(marker.key));
}

function findCategoryPosition(results, value) {
  const rows = results.table.rows;

  if (results.dataType === 'kelompok') {
    for (let i = 0; i < rows.length; i += 1) {
      if (value >= rows[i].lowerBoundary && value <= rows[i].upperBoundary) {
        const width = rows[i].upperBoundary - rows[i].lowerBoundary || 1;
        return i - 0.5 + ((value - rows[i].lowerBoundary) / width);
      }
    }
    return null;
  }

  for (let i = 0; i < rows.length; i += 1) {
    if (rows[i].xi === value) return i;
  }

  for (let i = 0; i < rows.length - 1; i += 1) {
    if (value > rows[i].xi && value < rows[i + 1].xi) {
      return i + ((value - rows[i].xi) / (rows[i + 1].xi - rows[i].xi));
    }
  }

  if (value <= rows[0].xi) return 0;
  return rows.length - 1;
}

function markerAnnotations(markers, positionForValue) {
  return Object.fromEntries(markers.map((marker, index) => {
    const x = positionForValue(marker.value);
    if (x === null || x === undefined || Number.isNaN(x)) return null;

    return [
      `${marker.key}Line`,
      {
        type: 'line',
        xMin: x,
        xMax: x,
        borderColor: marker.color,
        borderWidth: marker.key === 'mean' || marker.key === 'median' ? 2 : 1.5,
        borderDash: index % 2 === 0 ? [6, 4] : [2, 4],
        label: {
          display: true,
          content: `${marker.label}: ${formatNumber(marker.value)}`,
          color: marker.color,
          backgroundColor: '#fbf9f4',
          font: { family: CHART_FONT.family, size: 10, weight: '600' },
          padding: 4,
          borderRadius: 4,
          position: index % 2 === 0 ? 'start' : 'end',
        },
      },
    ];
  }).filter(Boolean));
}

function baseOptions(results, annotations = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: CHART_ANIMATION_DURATION },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: CHART_COLORS.tooltipBg,
        borderColor: CHART_COLORS.tooltipBorder,
        borderWidth: 1,
        titleFont: { family: CHART_FONT.family, size: 12 },
        bodyFont: { family: CHART_FONT.family, size: 11 },
        titleColor: CHART_COLORS.tooltipText,
        bodyColor: CHART_COLORS.tooltipText,
        cornerRadius: 6,
        padding: 10,
      },
      annotation: { annotations },
      zoom: {
        pan: { enabled: true, mode: 'x' },
        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
      },
    },
    scales: {
      x: {
        grid: { color: CHART_COLORS.grid },
        ticks: { color: CHART_COLORS.axis, font: { family: CHART_FONT.family, size: CHART_FONT.size } },
        title: {
          display: true,
          text: results.dataType === 'kelompok' ? 'Kelas Interval' : 'Nilai (xi)',
          color: CHART_COLORS.axis,
          font: { family: CHART_FONT.family, size: 12, weight: '700' },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: CHART_COLORS.grid },
        ticks: { color: CHART_COLORS.axis, font: { family: CHART_FONT.family, size: CHART_FONT.size } },
        title: {
          display: true,
          text: 'Frekuensi',
          color: CHART_COLORS.axis,
          font: { family: CHART_FONT.family, size: 12, weight: '700' },
        },
      },
    },
  };
}

function DistributionChart({ results, chartType, chartInstanceRef, visibleKeys }) {
  const rows = results.table.rows;
  const labels = rows.map(row => results.dataType === 'kelompok' ? row.classInterval : String(row.xi));
  const frequencies = rows.map(row => row.fi);
  const annotations = markerAnnotations(getMarkers(results, visibleKeys), value => findCategoryPosition(results, value));
  const commonDataset = {
    label: 'Frekuensi',
    data: frequencies,
    borderColor: CHART_COLORS.barHover,
    backgroundColor: chartType === 'bar' ? CHART_COLORS.bar : 'rgba(63, 102, 82, 0.18)',
    pointBackgroundColor: CHART_COLORS.barHover,
    pointRadius: chartType === 'bar' ? 0 : 4,
    borderWidth: 2,
    tension: chartType === 'polygon' ? 0 : 0.25,
    fill: chartType === 'polygon',
  };

  if (chartType === 'polygon') {
    return (
      <Line
        ref={chartInstanceRef}
        data={{ labels, datasets: [commonDataset] }}
        options={baseOptions(results, annotations)}
      />
    );
  }

  return (
    <Bar
      ref={chartInstanceRef}
      data={{
        labels,
        datasets: [{
          ...commonDataset,
          borderRadius: 4,
          borderSkipped: false,
          hoverBackgroundColor: CHART_COLORS.barHover,
        }],
      }}
      options={baseOptions(results, annotations)}
    />
  );
}

function OgiveChart({ results, chartInstanceRef, visibleKeys }) {
  const rows = results.table.rows;
  const dataPoints = rows.map(row => ({
    x: results.dataType === 'kelompok' ? row.upperBoundary : row.xi,
    y: row.fkum,
  }));
  const annotations = markerAnnotations(getMarkers(results, visibleKeys), value => value);
  const options = baseOptions(results, annotations);
  options.scales.x.type = 'linear';
  options.scales.x.title.text = 'Nilai batas atas';
  options.scales.y.title.text = 'Frekuensi kumulatif';

  return (
    <Line
      ref={chartInstanceRef}
      data={{
        datasets: [{
          label: 'Ogive',
          data: dataPoints,
          borderColor: CHART_COLORS.barHover,
          backgroundColor: 'rgba(193, 237, 210, 0.72)',
          pointBackgroundColor: CHART_COLORS.barHover,
          pointRadius: 4,
          borderWidth: 2,
          fill: true,
          tension: 0.25,
        }],
      }}
      options={options}
    />
  );
}

export default function FrequencyChart({ results, chartRef, chartType = 'bar', onChartTypeChange, visibleKeys }) {
  const localRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const containerRef = chartRef || localRef;

  if (!results?.table?.rows?.length) return null;

  const resetZoom = () => {
    chartInstanceRef.current?.resetZoom?.();
  };

  const summary = {
    bar: `Bar chart menampilkan distribusi frekuensi ${results.n} data.`,
    polygon: `Poligon frekuensi menghubungkan titik frekuensi untuk melihat pola naik turun data.`,
    ogive: `Ogive menampilkan frekuensi kumulatif sampai ${results.n} data.`,
  }[chartType];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-full border-2 border-border bg-bg-elevated p-1.5" role="tablist" aria-label="Jenis grafik">
          {CHART_TYPES.map(type => (
            <button
              key={type.key}
              type="button"
              onClick={() => onChartTypeChange?.(type.key)}
              className={`focus-ring interactive-press rounded-full border-2 px-4 py-2 text-xs font-bold transition-transform ${
                chartType === type.key
                  ? 'border-border bg-accent-primary text-white shadow-card'
                  : 'border-transparent text-text-secondary hover:bg-bg-surface hover:text-text-primary'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={resetZoom}
          className="focus-ring interactive-press inline-flex items-center gap-1.5 rounded-full border-2 border-border bg-bg-surface px-4 py-2 text-xs font-bold text-text-primary shadow-card hover:bg-accent-soft"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div ref={containerRef} className="relative rounded-lg border-2 border-border bg-bg-elevated p-5 shadow-card" style={{ height: '390px' }}>
        <h3 className="mb-2 text-2xl font-bold text-text-primary">
          {CHART_TYPES.find(type => type.key === chartType)?.label}
        </h3>
        <div className="h-[318px] rounded-sm border-2 border-border bg-bg-base p-2">
          {(chartType === 'bar' || chartType === 'polygon') && (
            <DistributionChart
              results={results}
              chartType={chartType}
              chartInstanceRef={chartInstanceRef}
              visibleKeys={visibleKeys}
            />
          )}
          {chartType === 'ogive' && (
            <OgiveChart results={results} chartInstanceRef={chartInstanceRef} visibleKeys={visibleKeys} />
          )}
        </div>
      </div>

      <div className="space-y-1 text-sm text-text-secondary" aria-live="polite">
        <p>{summary} Geser grafik untuk panning, scroll untuk zoom.</p>
        <p>Marker aktif: Mean {formatNumber(results.mean)}, Median {formatNumber(results.median)}, Modus {formatMode(results.mode)}, Q1 {formatNumber(results.q1)}, Q2 {formatNumber(results.q2)}, Q3 {formatNumber(results.q3)}, P{results.selectedP} {formatNumber(results.pk)}.</p>
      </div>
    </div>
  );
}
