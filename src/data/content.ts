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
    eyebrow: "01",
    title: "Pemanasan",
    prompt: "Sentuh 7 kali. Anggap aja pemanasan.",
    type: "click",
    target: 7,
    action: "Sentuh",
  },
  {
    id: "bright-name",
    eyebrow: "02",
    title: "Siapa yang ulang tahun?",
    prompt: "Ketik nama depannya.",
    type: "input",
    answers: ["sifta"],
    placeholder: "nama depan",
    hint: "5 huruf, mulai dari S.",
  },
  {
    id: "importance",
    eyebrow: "03",
    title: "Dia buat kamu gimana?",
    prompt: "Pilih yang paling jujur.",
    type: "choice",
    options: ["Biasa aja", "Penting", "Penting banget hari ini"],
    correct: 2,
  },
  {
    id: "date-code",
    eyebrow: "04",
    title: "Tanggal lahirnya?",
    prompt: "Ketik angka tanggalnya.",
    type: "input",
    answers: ["19", "sembilan belas", "19 tahun"],
    placeholder: "angka tanggal",
  },
  {
    id: "coffee",
    eyebrow: "05",
    title: "Kopi virtual",
    prompt: "Sentuh 5 kali. Gratis, nggak pakai utang.",
    type: "click",
    target: 5,
    action: "Kirim kopi",
  },
  {
    id: "good-things",
    eyebrow: "06",
    title: "Yang paling cocok",
    prompt: "Buat Sifta di umur barunya, yang paling cocok itu…",
    type: "choice",
    options: ["Makin keren", "Makin bahagia", "Semuanya"],
    correct: 2,
  },
  {
    id: "wish",
    eyebrow: "07",
    title: "Ucapannya apa?",
    prompt: "Tulis ucapan ulang tahun versi kamu.",
    type: "input",
    answers: ["happy birthday", "selamat ulang tahun", "hbd"],
    placeholder: "selamat ulang tahun",
    hint: "Boleh ditambahin namamu.",
  },
  {
    id: "energy",
    eyebrow: "08",
    title: "Semangat",
    prompt: "Sentuh 10 kali. Jangan berhenti dulu.",
    type: "click",
    target: 10,
    action: "Tangkap",
  },
  {
    id: "prayer",
    eyebrow: "09",
    title: "Doanya",
    prompt: "Doa yang paling pas buat hari ini.",
    type: "choice",
    options: ["Sehat selalu", "Bahagia selalu", "Semuanya sekaligus"],
    correct: 2,
  },
  {
    id: "kind-word",
    eyebrow: "10",
    title: "Satu kata",
    prompt: "Satu kata yang pengen kamu titipin. Minimal 3 huruf.",
    type: "input",
    minLength: 3,
    placeholder: "tenang / berani",
  },
];

export const successMessages = [
  "Nice, satu lagi nyala.",
  "Oke, polanya mulai kelihatan.",
  "Kekirim.",
  "Santai, jalurnya bener.",
  "Sifta-approved.",
];

export const secretMemories = [
  "Ada hari yang selalu kerasa beda. Hari ini salah satunya.",
  "Ada cerita yang selesai baik-baik. Doanya boleh tetap jalan.",
  "Tanggal baru, cerita baru. Semoga kamu makin tenang.",
  "Web ini dibuat tanpa tekanan. Cuma kata-kata dan sedikit ketawa.",
  "Semoga kamu seneng bukan cuma hari ini.",
];

export const positiveMessages = [
  "Semoga kamu makin berani jadi diri sendiri.",
  "Semoga mimpi-mimpimu makin dekat, nggak cuma jadi catatan jam dua pagi.",
  "Semoga rezekinya lancar dan cukup buat hal-hal yang kamu suka.",
  "Semoga harimu lebih banyak ketawa dan lebih sedikit capek.",
  "Semoga kamu selalu punya tempat buat pulang.",
  "Kalau lagi berat, inget kamu tetap pantes dapet hal baik.",
  "Semoga sehat, tenang, dan kopinya selalu pas.",
];

export const mascotLines = [
  "Halo, aku Bintang. Pencet aja kalau bosan.",
  "Nggak ada yang harus sempurna hari ini.",
  "Tarik napas dulu. Bintangnya nggak ke mana-mana.",
  "Barusan ada doa lewat di atas sana.",
  "Menurutku kamu pantes dapet banyak hal baik hari ini.",
];
