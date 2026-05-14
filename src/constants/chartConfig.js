export const CHART_COLORS = {
  bar: '#3f6652',
  barHover: '#061907',
  mean: '#ba1a1a',
  median: '#3f6652',
  grid: 'rgba(0, 0, 0, 0.16)',
  axis: '#061907',
  tooltipBg: '#1a2e1a',
  tooltipBorder: '#000000',
  tooltipText: '#ffffff',
};

export const MARKER_COLORS = {
  mean: '#ba1a1a',
  median: '#061907',
  mode: '#3f6652',
  q1: '#747871',
  q2: '#061907',
  q3: '#456d58',
  pk: '#93000a',
};

export const CHART_ANIMATION_DURATION = 600;

export const CHART_FONT = {
  family: "'Archivo Narrow', 'Arial Narrow', sans-serif",
  size: 12,
};

export const MEAN_ANNOTATION = {
  type: 'line',
  borderColor: CHART_COLORS.mean,
  borderWidth: 2,
  borderDash: [6, 4],
  label: {
    display: true,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    color: CHART_COLORS.mean,
    font: { family: CHART_FONT.family, size: 11, weight: '600' },
    padding: { top: 4, bottom: 4, left: 8, right: 8 },
    borderRadius: 6,
    position: 'start',
  },
};

export const MEDIAN_ANNOTATION = {
  type: 'line',
  borderColor: CHART_COLORS.median,
  borderWidth: 2,
  borderDash: [6, 4],
  label: {
    display: true,
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
    color: CHART_COLORS.median,
    font: { family: CHART_FONT.family, size: 11, weight: '600' },
    padding: { top: 4, bottom: 4, left: 8, right: 8 },
    borderRadius: 6,
    position: 'end',
  },
};
