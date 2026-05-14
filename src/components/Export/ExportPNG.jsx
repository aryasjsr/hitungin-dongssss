import { useState } from 'react';
import { ImageDown, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

export default function ExportPNG({ chartRef }) {
  const [loading, setLoading] = useState(false);

  const downloadBlob = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HitunginLab-chart-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (!chartRef?.current) {
      toast.error('Grafik belum tersedia.');
      return;
    }

    setLoading(true);
    try {
      const chartCanvas = chartRef.current.querySelector('canvas');
      if (chartCanvas?.toBlob) {
        chartCanvas.toBlob((blob) => {
          if (!blob) {
            toast.error('Gagal membuat file PNG.');
            return;
          }
          downloadBlob(blob);
          toast.success('Grafik berhasil diunduh sebagai PNG!');
        }, 'image/png');
        return;
      }

      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#16161e',
        scale: 2,
      });
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Gagal membuat file PNG.');
          return;
        }
        downloadBlob(blob);
        toast.success('Grafik berhasil diunduh sebagai PNG!');
      }, 'image/png');
    } catch (err) {
      toast.error('Gagal mengekspor PNG.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="focus-ring flex items-center gap-1.5 px-3 py-2 text-sm text-text-primary bg-transparent border border-border rounded-md hover:bg-bg-elevated disabled:opacity-45 disabled:cursor-not-allowed transition-colors duration-150"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <ImageDown size={16} />}
      {loading ? 'Mengekspor...' : 'PNG'}
    </button>
  );
}
