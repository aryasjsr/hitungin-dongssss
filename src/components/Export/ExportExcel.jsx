import { useState } from 'react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { formatMode } from '../../utils/formatters';
import toast from 'react-hot-toast';

function getParameterRows(results) {
  const rows = [
    ['Parameter', 'Nilai'],
    ['Jumlah Data (N)', results.n],
    ['Mean', results.mean],
    ['Median', results.median],
    ['Modus', formatMode(results.mode)],
    ['Q1', results.q1],
    ['Q2', results.q2],
    ['Q3', results.q3],
    [`P${results.selectedP}`, results.pk],
    ['Range', results.range],
    ['Varian (s2)', results.variance],
    ['Standar Deviasi (s)', results.stdDev],
    ['Min', results.min],
    ['Max', results.max],
  ];

  rows.push(['Outlier', results.outliers?.length ? results.outliers.join(', ') : 'Tidak ada']);
  return rows;
}

export default function ExportExcel({ results, chartType = 'bar' }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!results) return;
    setLoading(true);

    try {
      const wb = XLSX.utils.book_new();

      const dataHeaders = results.dataType === 'kelompok'
        ? ['Interval', 'Tepi Bawah', 'Tepi Atas', 'xi', 'fi', 'F kum', 'xi*fi', 'xi2*fi']
        : ['xi', 'fi', 'F kum', 'xi*fi', 'xi2*fi'];

      const dataRows = results.table.rows.map(r => {
        if (results.dataType === 'kelompok') {
          return [r.classInterval, r.lowerBoundary, r.upperBoundary, r.xi, r.fi, r.fkum, r.xiFi, r.xi2Fi];
        }
        return [r.xi, r.fi, r.fkum, r.xiFi, r.xi2Fi];
      });

      const totalRow = results.dataType === 'kelompok'
        ? ['Total', '', '', '', results.table.totals.sumFi, '', results.table.totals.sumXiFi, results.table.totals.sumXi2Fi]
        : ['Total', results.table.totals.sumFi, '', results.table.totals.sumXiFi, results.table.totals.sumXi2Fi];

      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([dataHeaders, ...dataRows, totalRow]), 'Data');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(getParameterRows(results)), 'Parameters');

      const markers = [
        ['Mean', results.mean],
        ['Median', results.median],
        ['Modus', formatMode(results.mode)],
        ['Q1', results.q1],
        ['Q2', results.q2],
        ['Q3', results.q3],
        [`P${results.selectedP}`, results.pk],
      ];

      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
        ['Info', 'Nilai'],
        ['Jenis Grafik Aktif', chartType],
        ['Tipe Data', results.dataType],
        ['Jumlah Baris Tabel', results.table.rows.length],
        ['Marker Aktif', markers.map(([label]) => label).join(', ')],
        [''],
        ['Marker', 'Nilai'],
        ...markers,
      ]), 'ChartsInfo');

      XLSX.writeFile(wb, 'HitunginLab-export.xlsx');
      toast.success('File Excel berhasil diunduh!');
    } catch (err) {
      toast.error('Gagal mengekspor Excel.');
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
      {loading ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
      {loading ? 'Mengekspor...' : 'Excel'}
    </button>
  );
}
