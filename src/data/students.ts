export interface Student {
  id: number;
  no: string;
  name: string;
  fullName: string;
  age: number;
  birthdate: string;
  position: string;
  kreditPoin: string;
  socials: Record<string, string>;
}

export const studentsData: Student[] = [
  {
    id: 0, no: "-", name: "Bu Dian", fullName: "Dian Hardianti, S.Kom.",
    age: 0, birthdate: "-", position: "Wali Kelas", kreditPoin: "-",
    socials: { instagram: "-", github: "-", twitter: "-" }
  },
  {
    id: 1, no: "1", name: "Abiyan", fullName: "ABIYAN ZUL FADLI",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", github: "-", twitter: "-" }
  },
  {
    id: 2, no: "2", name: "Bara", fullName: "AHMAD RAIHAN BATUBARA",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", github: "-", linkedin: "-" }
  },
  {
    id: 3, no: "3", name: "Amanda", fullName: "AMANDA WIDYA PRAMESTI",
    age: 0, birthdate: "-", position: "Sekretaris", kreditPoin: "-",
    socials: { instagram: "-", github: "-", twitter: "-" }
  },
  {
    id: 4, no: "4", name: "Ayesha", fullName: "AYESHA NADYA AFSARIANA",
    age: 16, birthdate: "04 Juni 2009", position: "Seksi Kebersihan", kreditPoin: "100",
    socials: { instagram: "-" }
  },
  {
    id: 5, no: "5", name: "Chantika", fullName: "CHANTIKA OCTAVIANY",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", github: "-", twitter: "-" }
  },
  {
    id: 6, no: "6", name: "Elsa", fullName: "ELSA MAYASARI",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", github: "-", linkedin: "-" }
  },
  {
    id: 7, no: "7", name: "Fajar", fullName: "FAJAR PERMANA PUTRA",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", github: "-", twitter: "-", tiktok: "-" }
  },
  {
    id: 8, no: "8", name: "Fathul", fullName: "FATHUL MUBIN",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 9, no: "9", name: "Gadis", fullName: "GADIS PUTRI HUDAYA",
    age: 17, birthdate: "07 Oktober 2008", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 10, no: "10", name: "Hafifa", fullName: "HAFIFA TUNURLIAH",
    age: 0, birthdate: "-", position: "Bendahara", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 11, no: "11", name: "Ibra", fullName: "IBRAHIM NAUFHAL",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 12, no: "12", name: "Irsyad", fullName: "IRSYAD MUSYAFFA",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 13, no: "13", name: "Kafka", fullName: "KAFKA NAVIZZA AGUSTIN",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 14, no: "14", name: "Klara", fullName: "KLARA AYU YUSNIA",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 15, no: "15", name: "Mario", fullName: "MARIO RAMDANI",
    age: 17, birthdate: "24 Maret 2008", position: "Ketua Kelas", kreditPoin: "-",
    socials: { instagram: "@swimmingfoxx_", github: "Marrwertz", game: "https://equinoxinteractive.github.io/BoxSiege/" }
  },
  {
    id: 16, no: "16", name: "Fathur", fullName: "MOCHAMAD FATHURAHMAN",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 17, no: "17", name: "Rafa", fullName: "MOHAMAD RAFA ZAMIZAR",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 18, no: "18", name: "Prasya", fullName: "MUHAMAD PRASYA SISWADI",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 19, no: "19", name: "Fatih", fullName: "MUHAMMAD AL FATIH HAIDAR",
    age: 17, birthdate: "22 Juni 2008", position: "Wakil Ketua kelas", kreditPoin: "97",
    socials: { instagram: "@alf219881" }
  },
  {
    id: 20, no: "20", name: "Defran", fullName: "MUHAMMAD DEFRANS ABDULLAH HAJRIN",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 21, no: "21", name: "Mulki", fullName: "MUHAMMAD MALIKUL MULKI",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 22, no: "22", name: "Rafa", fullName: "MUHAMMAD RAFA PRATAMA",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 23, no: "23", name: "Akbar", fullName: "MUHAMMAD RIZKY AKBAR GOZALI",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 24, no: "24", name: "Natasya", fullName: "NATASYA MELINDA",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 25, no: "25", name: "Rafi", fullName: "RAFI ADIYATMA TRI FALAH",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 26, no: "26", name: "Rakas", fullName: "RAKA SYAFA'ATAN",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 27, no: "27", name: "Raya", fullName: "RAYA AHMAD FADILAH",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 28, no: "28", name: "Revan", fullName: "REVAN DWI ERLANGGA",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 29, no: "29", name: "Rizky", fullName: "RIZKY MAULANA PUTRA",
    age: 16, birthdate: "06 Maret 2009", position: "Developer", kreditPoin: "100",
    socials: { instagram: "@rzky.mp_36", twitter: "@BadutZYY_", youtube: "@badutzy", github: "BadutZY", game: "https://equinoxinteractive.github.io/BoxSiege/" }
  },
  {
    id: 30, no: "30", name: "Sandi", fullName: "SANDI SANJAYA",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
  {
    id: 31, no: "31", name: "Sultan", fullName: "SULTAN BIMA AGASSI",
    age: 0, birthdate: "-", position: "-", kreditPoin: "-",
    socials: { instagram: "-", twitter: "-", youtube: "-" }
  },
];
