export const FORMULA_LABELS = {
  mean: {
    label: 'Mean',
    description: 'Rata-rata hitung dari data.',
    formula: 'mean = sum(x) / n',
    formulaSingle: 'mean = sum(x) / n',
    formulaGrouped: 'mean = sum(fi * xi) / sum(fi)',
  },
  median: {
    label: 'Median',
    description: 'Nilai tengah data setelah diurutkan.',
    formula: 'Tunggal: nilai tengah; Kelompok: L + ((N/2 - F) / f) * c',
    formulaSingle: 'Ganjil: nilai tengah. Genap: rata-rata dua nilai tengah.',
    formulaGrouped: 'Median = L + ((N/2 - F) / f) * c',
  },
  mode: {
    label: 'Modus',
    description: 'Nilai dengan frekuensi tertinggi.',
    formula: 'Kelompok: L + (d1 / (d1 + d2)) * c',
    formulaSingle: 'Nilai yang paling sering muncul.',
    formulaGrouped: 'Modus = L + (d1 / (d1 + d2)) * c',
  },
  quartile: {
    label: 'Kuartil',
    description: 'Membagi data menjadi 4 bagian.',
    formula: 'Tunggal: k(n+1)/4; Kelompok: L + ((kN/4 - F) / f) * c',
    formulaSingle: 'posisi Qk = k(n+1)/4, interpolasi linear.',
    formulaGrouped: 'Qk = L + ((kN/4 - F) / f) * c',
  },
  percentile: {
    label: 'Persentil',
    description: 'Membagi data menjadi 100 bagian.',
    formula: 'Tunggal: k(n+1)/100; Kelompok: L + ((kN/100 - F) / f) * c',
    formulaSingle: 'posisi Pk = k(n+1)/100, interpolasi linear.',
    formulaGrouped: 'Pk = L + ((kN/100 - F) / f) * c',
  },
  variance: {
    label: 'Varian (s2)',
    description: 'Ukuran sebaran data terhadap mean. Menggunakan pembagi n-1 (sampel).',
    formulaSingle: 's2 = sum((x - mean)^2) / (n - 1)',
    formulaGrouped: 's2 = sum(fi * (xi - mean)^2) / (N - 1)',
  },
  stdDev: {
    label: 'Standar Deviasi (s)',
    description: 'Akar kuadrat dari varian sampel.',
    formula: 's = sqrt(s2)',
  },
  iqr: {
    label: 'IQR',
    description: 'Rentang antar kuartil, yaitu jarak dari Q1 ke Q3.',
    formula: 'IQR = Q3 - Q1',
  },
  cv: {
    label: 'Koefisien Variasi (CV)',
    description: 'Perbandingan standar deviasi terhadap mean dalam persen.',
    formula: 'CV = (s / abs(mean)) * 100%',
  },
  range: {
    label: 'Range',
    description: 'Selisih antara nilai terbesar dan terkecil.',
    formula: 'Range = max - min',
  },
  min: {
    label: 'Minimum',
    description: 'Nilai terkecil dalam data.',
    formula: 'min = nilai pertama setelah data diurutkan naik',
  },
  max: {
    label: 'Maximum',
    description: 'Nilai terbesar dalam data.',
    formula: 'max = nilai terakhir setelah data diurutkan naik',
  },
  n: {
    label: 'Jumlah Data (n atau N)',
    description: 'Banyaknya data yang dianalisis.',
    formula: 'Tunggal: n = jumlah x; Berfrekuensi/kelompok: N = sum(fi)',
  },
  outlier: {
    label: 'Outlier',
    description: 'Data di luar pagar 1.5 * IQR.',
    formula: 'Batas bawah = Q1 - 1.5 * IQR; batas atas = Q3 + 1.5 * IQR',
  },
};

export const FORMULA_MATH_DISPLAY = {
  mean: {
    general: 'x\u0305 = \u2211x / n',
    single: 'x\u0305 = (x\u2081 + x\u2082 + ... + x\u2099) / n',
    grouped: 'x\u0305 = \u2211(f\u1d62x\u1d62) / \u2211f\u1d62',
  },
  median: {
    general: 'Me = nilai tengah data terurut',
    single: 'n ganjil: x((n+1)/2)   |   n genap: (x(n/2) + x(n/2+1)) / 2',
    grouped: 'Me = L + ((N/2 - F) / f) c',
  },
  mode: {
    general: 'Mo = nilai dengan frekuensi terbesar',
    single: 'Mo = x dengan f maksimum',
    grouped: 'Mo = L + (d\u2081 / (d\u2081 + d\u2082)) c',
  },
  quartile: {
    general: 'Q\u2096 membagi data menjadi 4 bagian',
    single: 'Posisi Q\u2096 = k(n + 1) / 4',
    grouped: 'Q\u2096 = L + ((kN/4 - F) / f) c',
  },
  percentile: {
    general: 'P\u2096 membagi data menjadi 100 bagian',
    single: 'Posisi P\u2096 = k(n + 1) / 100',
    grouped: 'P\u2096 = L + ((kN/100 - F) / f) c',
  },
  variance: {
    general: 's\u00b2 = jumlah kuadrat deviasi / derajat bebas',
    single: 's\u00b2 = \u2211(x - x\u0305)\u00b2 / (n - 1)',
    grouped: 's\u00b2 = \u2211f\u1d62(x\u1d62 - x\u0305)\u00b2 / (N - 1)',
  },
  stdDev: {
    general: 's = \u221as\u00b2',
  },
  iqr: {
    general: 'IQR = Q\u2083 - Q\u2081',
  },
  cv: {
    general: 'CV = (s / |x\u0305|) \u00d7 100%',
  },
  range: {
    general: 'R = x\u2098\u2090\u2093 - x\u2098\u1d62\u2099',
  },
  min: {
    general: 'Min = x\u2081 setelah data diurutkan naik',
  },
  max: {
    general: 'Max = x\u2099 setelah data diurutkan naik',
  },
  n: {
    general: 'Data tunggal: n = banyak x   |   Data frekuensi: N = \u2211f\u1d62',
  },
  outlier: {
    general: 'Batas bawah = Q\u2081 - 1.5(IQR)   |   Batas atas = Q\u2083 + 1.5(IQR)',
  },
};

export const FORMULA_SYMBOLS = [
  { symbol: 'x', meaning: 'Nilai data tunggal.' },
  { symbol: 'xi', meaning: 'Nilai data pada tabel frekuensi atau titik tengah kelas.' },
  { symbol: 'fi', meaning: 'Frekuensi untuk xi atau kelas interval.' },
  { symbol: 'n', meaning: 'Jumlah data tunggal.' },
  { symbol: 'N', meaning: 'Total frekuensi, yaitu sum(fi).' },
  { symbol: 'L', meaning: 'Tepi bawah kelas yang memuat median, kuartil, persentil, atau modus.' },
  { symbol: 'F', meaning: 'Frekuensi kumulatif sebelum kelas target.' },
  { symbol: 'f', meaning: 'Frekuensi pada kelas target.' },
  { symbol: 'c', meaning: 'Panjang kelas interval.' },
  { symbol: 'd1', meaning: 'Selisih frekuensi kelas modus dengan kelas sebelumnya.' },
  { symbol: 'd2', meaning: 'Selisih frekuensi kelas modus dengan kelas berikutnya.' },
  { symbol: 's2', meaning: 'Varian sampel.' },
  { symbol: 's', meaning: 'Standar deviasi sampel.' },
];

export const FORMULA_GUIDELINES = [
  {
    key: 'n',
    appliesTo: 'Semua jenis data',
    tips: 'Untuk data berfrekuensi dan data kelompok, jumlah data dihitung dari total frekuensi.',
  },
  {
    key: 'min',
    appliesTo: 'Data tunggal, berfrekuensi, dan kelompok',
    tips: 'Pada data kelompok, aplikasi memakai tepi bawah kelas pertama sebagai pendekatan minimum.',
  },
  {
    key: 'max',
    appliesTo: 'Data tunggal, berfrekuensi, dan kelompok',
    tips: 'Pada data kelompok, aplikasi memakai tepi atas kelas terakhir sebagai pendekatan maksimum.',
  },
  {
    key: 'mean',
    appliesTo: 'Semua jenis data',
    tips: 'Untuk data kelompok, xi adalah titik tengah kelas sehingga hasilnya berupa estimasi.',
  },
  {
    key: 'median',
    appliesTo: 'Semua jenis data',
    tips: 'Data tunggal memakai posisi tengah setelah diurutkan. Data kelompok memakai interpolasi pada kelas median.',
  },
  {
    key: 'mode',
    appliesTo: 'Semua jenis data',
    tips: 'Jika semua nilai atau semua frekuensi sama, aplikasi menampilkan tidak ada modus.',
  },
  {
    key: 'quartile',
    appliesTo: 'Q1, Q2, dan Q3',
    tips: 'Q2 setara dengan median. Data tunggal memakai posisi k(n+1)/4 dengan interpolasi linear.',
  },
  {
    key: 'percentile',
    appliesTo: 'Pk pilihan pengguna',
    tips: 'Nilai k diambil dari slider persentil pada panel input.',
  },
  {
    key: 'range',
    appliesTo: 'Semua jenis data',
    tips: 'Range makin besar berarti rentang data makin lebar, tetapi belum menjelaskan pola sebaran di tengah.',
  },
  {
    key: 'iqr',
    appliesTo: 'Semua jenis data',
    tips: 'IQR dipakai untuk membaca sebaran tengah 50% data dan menjadi dasar deteksi outlier.',
  },
  {
    key: 'variance',
    appliesTo: 'Semua jenis data',
    tips: 'Aplikasi memakai varian sampel dengan pembagi n - 1 atau N - 1.',
  },
  {
    key: 'stdDev',
    appliesTo: 'Semua jenis data',
    tips: 'Standar deviasi lebih mudah dibaca daripada varian karena satuannya kembali sama dengan data awal.',
  },
  {
    key: 'cv',
    appliesTo: 'Semua jenis data',
    tips: 'Jika mean = 0, CV tidak terdefinisi karena pembaginya nol.',
  },
  {
    key: 'outlier',
    appliesTo: 'Data tunggal dan berfrekuensi',
    tips: 'Outlier data kelompok tidak dihitung karena data asli per observasi tidak tersedia.',
  },
];
