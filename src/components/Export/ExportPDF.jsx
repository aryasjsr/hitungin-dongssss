import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { jsPDF } from 'jspdf';
import { formatNumber, formatMode } from '../../utils/formatters';
import { CHART_COLORS, CHART_FONT } from '../../constants/chartConfig';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler);

const CHART_EXPORTS = [
  { key: 'bar', label: 'Grafik Bar' },
  { key: 'polygon', label: 'Grafik Poligon' },
  { key: 'ogive', label: 'Grafik Ogive' },
];

function addLine(doc, text, x, y, options = {}) {
  doc.text(String(text), x, y, options);
  return y + 6;
}

function addPageIfNeeded(doc, y, neededHeight = 10, margin = 14) {
  if (y + neededHeight < 285) return y;
  doc.addPage();
  return margin;
}

function pdfChartOptions(results, chartType) {
  const isOgive = chartType === 'ogive';
  return {
    responsive: false,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        type: isOgive ? 'linear' : 'category',
        grid: { color: CHART_COLORS.grid },
        ticks: { color: CHART_COLORS.axis, font: { family: CHART_FONT.family, size: 11 } },
        title: {
          display: true,
          text: isOgive ? 'Nilai batas atas' : results.dataType === 'kelompok' ? 'Kelas Interval' : 'Nilai (xi)',
          color: CHART_COLORS.axis,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: CHART_COLORS.grid },
        ticks: { color: CHART_COLORS.axis, font: { family: CHART_FONT.family, size: 11 } },
        title: {
          display: true,
          text: isOgive ? 'Frekuensi kumulatif' : 'Frekuensi',
          color: CHART_COLORS.axis,
        },
      },
    },
  };
}

async function renderChartImage(results, chartType) {
  const canvas = document.createElement('canvas');
  canvas.width = 1100;
  canvas.height = 520;
  const rows = results.table.rows;
  const labels = rows.map(row => results.dataType === 'kelompok' ? row.classInterval : String(row.xi));
  const frequencies = rows.map(row => row.fi);
  const isOgive = chartType === 'ogive';
  const chart = new ChartJS(canvas, {
    type: chartType === 'bar' ? 'bar' : 'line',
    data: isOgive
      ? {
          datasets: [{
            label: 'Ogive',
            data: rows.map(row => ({
              x: results.dataType === 'kelompok' ? row.upperBoundary : row.xi,
              y: row.fkum,
            })),
            borderColor: CHART_COLORS.barHover,
            backgroundColor: 'rgba(34, 197, 94, 0.14)',
            pointBackgroundColor: CHART_COLORS.barHover,
            pointRadius: 4,
            borderWidth: 3,
            fill: true,
            tension: 0.25,
          }],
        }
      : {
          labels,
          datasets: [{
            label: 'Frekuensi',
            data: frequencies,
            borderColor: CHART_COLORS.barHover,
            backgroundColor: chartType === 'bar' ? CHART_COLORS.bar : 'rgba(168, 85, 247, 0.16)',
            pointBackgroundColor: CHART_COLORS.barHover,
            pointRadius: chartType === 'bar' ? 0 : 4,
            borderWidth: 3,
            borderRadius: chartType === 'bar' ? 5 : 0,
            fill: chartType === 'polygon',
            tension: chartType === 'polygon' ? 0 : 0.25,
          }],
        },
    options: pdfChartOptions(results, chartType),
  });

  await new Promise(resolve => requestAnimationFrame(resolve));
  const image = canvas.toDataURL('image/png', 1);
  chart.destroy();
  return image;
}

function drawReportTable(doc, results, startY) {
  const isGrouped = results.dataType === 'kelompok';
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const tableWidth = pageWidth - (margin * 2);
  const rowHeight = 7;
  const columns = isGrouped
    ? [
        { label: 'No', key: 'no', width: 9, align: 'right' },
        { label: 'Interval', key: 'classInterval', width: 31, align: 'left' },
        { label: 'T. Bawah', key: 'lowerBoundary', width: 20, align: 'right' },
        { label: 'T. Atas', key: 'upperBoundary', width: 20, align: 'right' },
        { label: 'xi', key: 'xi', width: 18, align: 'right' },
        { label: 'fi', key: 'fi', width: 13, align: 'right' },
        { label: 'Fkum', key: 'fkum', width: 17, align: 'right' },
        { label: 'xi.fi', key: 'xiFi', width: 25, align: 'right' },
        { label: 'xi2.fi', key: 'xi2Fi', width: 29, align: 'right' },
      ]
    : [
        { label: 'No', key: 'no', width: 12, align: 'right' },
        { label: 'xi', key: 'xi', width: 35, align: 'right' },
        { label: 'fi', key: 'fi', width: 24, align: 'right' },
        { label: 'Fkum', key: 'fkum', width: 28, align: 'right' },
        { label: 'xi.fi', key: 'xiFi', width: 39, align: 'right' },
        { label: 'xi2.fi', key: 'xi2Fi', width: 44, align: 'right' },
      ];

  const drawHeader = (y) => {
    doc.setFillColor(37, 37, 53);
    doc.setDrawColor(180, 180, 190);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.rect(margin, y, tableWidth, rowHeight, 'F');

    let x = margin;
    columns.forEach((column) => {
      doc.rect(x, y, column.width, rowHeight);
      doc.text(column.label, column.align === 'right' ? x + column.width - 2 : x + 2, y + 4.7, {
        align: column.align,
      });
      x += column.width;
    });

    return y + rowHeight;
  };

  const valueFor = (row, column, index) => {
    if (column.key === 'no') return index + 1;
    if (column.key === 'classInterval') return row.classInterval;
    if (column.key === 'fi' || column.key === 'fkum') return row[column.key];
    if (column.key === 'lowerBoundary' || column.key === 'upperBoundary') return formatNumber(row[column.key], 1);
    return formatNumber(row[column.key]);
  };

  let y = drawHeader(startY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);

  results.table.rows.forEach((row, index) => {
    if (y + rowHeight > 285) {
      doc.addPage();
      y = drawHeader(margin);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
    }

    doc.setTextColor(20, 20, 26);
    doc.setDrawColor(210, 210, 218);
    if (index % 2 === 0) {
      doc.setFillColor(248, 248, 252);
      doc.rect(margin, y, tableWidth, rowHeight, 'F');
    }

    let x = margin;
    columns.forEach((column) => {
      const value = String(valueFor(row, column, index));
      doc.rect(x, y, column.width, rowHeight);
      doc.text(value, column.align === 'right' ? x + column.width - 2 : x + 2, y + 4.7, {
        align: column.align,
        maxWidth: column.width - 4,
      });
      x += column.width;
    });
    y += rowHeight;
  });

  if (y + rowHeight > 285) {
    doc.addPage();
    y = drawHeader(margin);
  }

  doc.setFillColor(237, 231, 255);
  doc.setTextColor(30, 20, 60);
  doc.setFont('helvetica', 'bold');
  doc.rect(margin, y, tableWidth, rowHeight, 'F');

  let x = margin;
  columns.forEach((column) => {
    let value = '';
    if (column.key === 'no') value = 'Total';
    if (column.key === 'fi') value = String(results.table.totals.sumFi);
    if (column.key === 'xiFi') value = formatNumber(results.table.totals.sumXiFi);
    if (column.key === 'xi2Fi') value = formatNumber(results.table.totals.sumXi2Fi);
    doc.rect(x, y, column.width, rowHeight);
    if (value) {
      doc.text(value, column.align === 'right' ? x + column.width - 2 : x + 2, y + 4.7, {
        align: column.align,
        maxWidth: column.width - 4,
      });
    }
    x += column.width;
  });

  doc.setTextColor(0, 0, 0);
  return y + rowHeight + 4;
}

export default function ExportPDF({ results, chartType = 'bar' }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!results) return;
    setLoading(true);

    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 14;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      y = addLine(doc, 'HitunginLab Report', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      y = addLine(doc, `Tanggal export: ${new Date().toLocaleString('id-ID')}`, 14, y);
      y = addLine(doc, `Tipe data: ${results.dataType} | N: ${results.n} | Grafik aktif: ${chartType}`, 14, y);
      y += 3;

      doc.setFont('helvetica', 'bold');
      y = addLine(doc, 'Parameter Statistik', 14, y);
      doc.setFont('helvetica', 'normal');
      const params = [
        ['Mean', results.mean],
        ['Median', results.median],
        ['Modus', formatMode(results.mode)],
        ['Q1', results.q1],
        ['Q2', results.q2],
        ['Q3', results.q3],
        [`P${results.selectedP}`, results.pk],
        ['Range', results.range],
        ['Varian (s2)', results.variance],
        ['StdDev (s)', results.stdDev],
        ['Min', results.min],
        ['Max', results.max],
        ['Outlier', results.outliers?.length ? results.outliers.join(', ') : 'Tidak ada'],
      ];

      params.forEach(([label, value], index) => {
        const colX = index % 2 === 0 ? 18 : 106;
        if (index % 2 === 0) y = addPageIfNeeded(doc, y, 8);
        doc.text(`${label}: ${typeof value === 'number' ? formatNumber(value) : value}`, colX, y);
        if (index % 2 === 1) y += 6;
      });
      if (params.length % 2 === 1) y += 6;

      y += 4;
      doc.setFont('helvetica', 'bold');
      y = addLine(doc, 'Grafik', 14, y);
      doc.setFont('helvetica', 'normal');

      for (const chart of CHART_EXPORTS) {
        const image = await renderChartImage(results, chart.key);
        const width = pageWidth - 28;
        const height = 76;
        y = addPageIfNeeded(doc, y, height + 13);
        doc.setFont('helvetica', 'bold');
        y = addLine(doc, chart.label, 14, y);
        doc.addImage(image, 'PNG', 14, y, width, height);
        y += height + 8;
      }

      y = addPageIfNeeded(doc, y, 20);
      doc.setFont('helvetica', 'bold');
      y = addLine(doc, 'Tabel Data', 14, y);
      drawReportTable(doc, results, y);

      doc.save(`HitunginLab-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success('PDF report berhasil diunduh!');
    } catch (err) {
      toast.error('Gagal mengekspor PDF.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={!results || loading}
      className="focus-ring flex items-center gap-1.5 px-3 py-2 text-sm text-text-primary bg-transparent border border-border rounded-md hover:bg-bg-elevated disabled:opacity-45 disabled:cursor-not-allowed transition-colors duration-150"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
      {loading ? 'Mengekspor...' : 'PDF'}
    </button>
  );
}
