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
    eyebrow: "01 · Pemanasan",
    title: "Buka orbit pertama",
    prompt: "Sentuh tujuh kali. Anggap ini pemanasan kecil sebelum langitnya benar-benar terbuka.",
    type: "click",
    target: 7,
    action: "Sentuh orbit",
  },
  {
    id: "bright-name",
    eyebrow: "02 · Sebuah nama",
    title: "Sebut nama yang bersinar",
    prompt: "Ketik nama orang yang kita rayakan hari ini.",
    type: "input",
    answers: ["sifta"],
    placeholder: "nama depan",
    hint: "Petunjuk: lima huruf, dimulai dengan S.",
  },
  {
    id: "importance",
    eyebrow: "03 · Jawaban jujur",
    title: "Seberapa berarti dia?",
    prompt: "Pilih jawaban yang paling jujur menurut hatimu.",
    type: "choice",
    options: ["Biasa saja", "Berarti", "Paling berarti hari ini"],
    correct: 2,
  },
  {
    id: "date-code",
    eyebrow: "04 · Kode tanggal",
    title: "Masukkan angka keramat",
    prompt: "Tanggalnya berganti setiap tahun, tapi niat baiknya tetap sama. Ketik angka hari lahirnya.",
    type: "input",
    answers: ["19", "sembilan belas", "19 tahun"],
    placeholder: "angka hari",
  },
  {
    id: "coffee",
    eyebrow: "05 · Ritual kecil",
    title: "Kirim kopi virtual",
    prompt: "Sentuh lima kali. Tanpa cerita lama, tanpa tagihan. Cuma secangkir hangat untuk hari ini.",
    type: "click",
    target: 5,
    action: "Kirim kopi",
  },
  {
    id: "good-things",
    eyebrow: "06 · Yang paling pas",
    title: "Pilih yang paling cocok",
    prompt: "Hal yang paling cocok untuk Sifta di usia barunya adalah…",
    type: "choice",
    options: ["Makin keren", "Makin bahagia", "Semuanya benar"],
    correct: 2,
  },
  {
    id: "wish",
    eyebrow: "07 · Harapan",
    title: "Tulis ucapan kecil",
    prompt: "Ketik ucapan ulang tahun yang paling tulus menurutmu.",
    type: "input",
    answers: ["happy birthday", "selamat ulang tahun", "hbd"],
    placeholder: "selamat ulang tahun",
    hint: "Boleh tambahkan namamu di belakangnya.",
  },
  {
    id: "energy",
    eyebrow: "08 · Energi",
    title: "Tangkap semangatnya",
    prompt: "Sentuh sepuluh kali. Semangat sering datang dari hal-hal kecil yang diulang dengan sabar.",
    type: "click",
    target: 10,
    action: "Tangkap cahaya",
  },
  {
    id: "prayer",
    eyebrow: "09 · Doa",
    title: "Pilih doa terbaik",
    prompt: "Doa yang paling pas untuk hari ini adalah…",
    type: "choice",
    options: ["Sehat selalu", "Bahagia selalu", "Semua doa baik sekaligus"],
    correct: 2,
  },
  {
    id: "kind-word",
    eyebrow: "10 · Orbit terakhir",
    title: "Satu kata untuk dititipkan",
    prompt: "Ketik satu kata yang ingin kamu titipkan untuk Sifta. Minimal tiga huruf, lalu orbit terakhir menyala.",
    type: "input",
    minLength: 3,
    placeholder: "tenang / berani / hangat",
  },
];

export const successMessages = [
  "Satu orbit menyala. Cahayanya kecil, tapi nyata.",
  "Bagus. Langitnya mulai membentuk polanya sendiri.",
  "Tersimpan. Niat baiknya sudah sampai.",
  "Pelan-pelan saja, kamu sedang di jalur yang tepat.",
  "Sifta-approved.",
];

export const secretMemories = [
  "Ada hari yang terasa lebih dekat dari hari lain, dan hari ini salah satunya.",
  "Beberapa cerita selesai dengan baik. Doa baiknya tidak perlu ikut selesai.",
  "Tanggal baru, bab baru. Semoga hatimu makin lapang dari hari ke hari.",
  "Website ini dibuat tanpa tekanan. Hanya kata-kata, sedikit cahaya, dan tawa kecil.",
  "Semoga kamu bahagia bukan cuma hari ini, tapi juga di banyak hari setelahnya.",
];

export const positiveMessages = [
  "Semoga di usia barumu, kamu makin berani menjadi dirimu sendiri, makin tenang menghadapi hal yang belum pasti, dan tetap punya tawa yang menular.",
  "Semoga mimpi-mimpimu pelan-pelan berpindah dari catatan tengah malam menjadi kenyataan yang bisa kamu genggam.",
  "Semoga rezekimu datang lewat jalan yang tak terduga, dan selalu cukup untuk hal-hal yang kamu cintai.",
  "Semoga harimu lebih banyak diisi tawa, dan lebih sedikit diisi hal yang menguras tenaga.",
  "Semoga kamu selalu punya tempat aman untuk pulang, baik ke orang-orang yang kamu sayang maupun ke dirimu sendiri.",
  "Kalau suatu hari terasa berat, ingat: kamu tetap layak mendapat hal-hal baik, bahkan saat kamu lupa.",
  "Semoga sehat, tenang, dan selalu ditemani kopi yang pas.",
];

export const mascotLines = [
  "Halo, aku Bintang kecil. Sentuh aku kalau mau sedikit cahaya.",
  "Hari ini tidak ada yang harus sempurna. Cukup hadir saja.",
  "Tarik napas dulu. Langitnya tidak akan pergi ke mana-mana.",
  "Ssst… ada doa baik yang sedang lewat di atas sana.",
  "Aku sudah menghitung: kamu layak mendapat banyak cahaya hari ini.",
];
