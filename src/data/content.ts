export type Challenge =
  | {
      id: string;
      eyebrow: string;
      title: string;
      prompt: string;
      type: "click";
      target: number;
      action: string;
    }
  | {
      id: string;
      eyebrow: string;
      title: string;
      prompt: string;
      type: "input";
      answers?: string[];
      minLength?: number;
      placeholder: string;
      hint?: string;
    }
  | {
      id: string;
      eyebrow: string;
      title: string;
      prompt: string;
      type: "choice";
      options: string[];
      correct: number;
    };

export const BIRTHDAY_DATE = "19 September 2005";
export const BIRTHDAY_DAY = "19 September";

export const challenges: Challenge[] = [
  {
    id: "warm-up",
    eyebrow: "01 / Warm-up",
    title: "Buka orbit pertama",
    prompt: "Tekan tombol tujuh kali. Anggap ini pemanasan kecil sebelum langit terbuka.",
    type: "click",
    target: 7,
    action: "Tekan orbit",
  },
  {
    id: "bright-name",
    eyebrow: "02 / A name",
    title: "Sebut nama yang bersinar",
    prompt: "Ketik nama orang yang dirayakan hari ini.",
    type: "input",
    answers: ["sifta"],
    placeholder: "nama depan",
    hint: "Petunjuk: SA.",
  },
  {
    id: "importance",
    eyebrow: "03 / The answer",
    title: "Seberapa penting dia?",
    prompt: "Pilih jawaban yang terasa paling benar.",
    type: "choice",
    options: ["Biasa saja", "Penting", "Paling penting hari ini"],
    correct: 2,
  },
  {
    id: "date-code",
    eyebrow: "04 / Date code",
    title: "Masukkan angka keramat",
    prompt: "Tanggalnya berubah, tapi niat baiknya tetap sama. Ketik angka hari lahirnya.",
    type: "input",
    answers: ["19", "sembilan belas", "19 tahun"],
    placeholder: "angka hari",
  },
  {
    id: "coffee",
    eyebrow: "05 / Small ritual",
    title: "Kirim kopi virtual",
    prompt: "Tekan lima kali. Tanpa flashback, tanpa tagihan.",
    type: "click",
    target: 5,
    action: "Kirim kopi",
  },
  {
    id: "good-things",
    eyebrow: "06 / Good things",
    title: "Pilih yang paling cocok",
    prompt: "Hal yang paling cocok untuk Sifta di usia baru adalah…",
    type: "choice",
    options: ["Makin keren", "Makin bahagia", "Semuanya benar"],
    correct: 2,
  },
  {
    id: "wish",
    eyebrow: "07 / The wish",
    title: "Tulis ucapan kecil",
    prompt: "Ketik ucapan ulang tahun yang paling tepat.",
    type: "input",
    answers: ["happy birthday", "selamat ulang tahun", "hbd"],
    placeholder: "happy birthday",
    hint: "Boleh tambah nama.",
  },
  {
    id: "energy",
    eyebrow: "08 / Energy",
    title: "Tangkap semangat",
    prompt: "Tekan tombol sepuluh kali. Jangan kasih kendor.",
    type: "click",
    target: 10,
    action: "Tangkap cahaya",
  },
  {
    id: "prayer",
    eyebrow: "09 / A prayer",
    title: "Pilih doa terbaik",
    prompt: "Doa paling pas untuk hari ini adalah…",
    type: "choice",
    options: ["Sehat selalu", "Bahagia selalu", "Semua doa baik sekaligus"],
    correct: 2,
  },
  {
    id: "kind-word",
    eyebrow: "10 / Final orbit",
    title: "Satu kata baik",
    prompt: "Ketik satu kata baik. Minimal tiga huruf, biar orbit terakhir menyala.",
    type: "input",
    minLength: 3,
    placeholder: "bahagia / semangat",
  },
];

export const successMessages = [
  "Orbit aman. Satu cahaya lagi menyala.",
  "Bagus. Langitnya mulai membentuk pola.",
  "Lolos. Niat baiknya terkirim.",
  "Keren. Kita lanjut pelan-pelan.",
  "Sifta-approved.",
];

export const secretMemories = [
  "Ada hari tertentu yang selalu terasa lebih dekat dari hari lain.",
  "Beberapa cerita selesai, tapi doa baik tidak pernah expired.",
  "Tanggal baru, chapter baru, hati yang semoga lebih tenang.",
  "Microsite ini dibuat tanpa tekanan. Cuma ucapan dan tawa kecil.",
  "Semoga Sifta bahagia, bukan cuma hari ini, tapi di banyak hari setelahnya.",
];

export const positiveMessages = [
  "Sifta versi 19 September: semoga makin keren, makin bijak, makin tenang, dan tetap punya tawa yang enak.",
  "Semoga semua mimpi pelan-pelan jadi nyata, bukan cuma jadi draft jam dua pagi.",
  "Semoga rezekinya mengalir seperti kopi tanpa henti.",
  "Semoga hari-harinya penuh tawa, bukan penuh drama.",
  "Chapter baru: lebih kuat, lebih bersinar, dan lebih sayang diri sendiri.",
  "Kalau ada yang bikin sedih, ingat: kamu tetap layak mendapat hal-hal baik.",
  "Semoga sehat selalu, dompet aman, hati tenang, dan kopi tetap ada.",
];
