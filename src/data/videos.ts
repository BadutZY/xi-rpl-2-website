// Cara menambah KATEGORI baru:
//   1. Tambahkan entry baru di array `videoCategories`.
//   2. Pakai `id` unik (huruf kecil, tanpa spasi).
//
// Cara menambah VIDEO baru:
//   1. Tambahkan object di array `videos`.
//   2. Set `categoryId` sesuai kategori yang sudah didefinisikan.
//   3. `type` boleh: "youtube" | "local" | "instagram"
//        - youtube  : isi `src` dengan URL/ID YouTube
//                     contoh: "https://youtu.be/dQw4w9WgXcQ"
//        - local    : taruh file di `public/videos/...` lalu
//                     isi `src` dengan "/videos/namafile.mp4"
//        - instagram: isi `src` dengan URL post/reel Instagram
//                     (akan ditampilkan via official embed)
//   4. `thumbnail` (cover gambar untuk kartu video):
//        - YouTube  : KOSONGKAN. Akan otomatis pakai thumbnail YouTube.
//        - Instagram: KOSONGKAN. Cover bawaan IG akan tampil di embed.
//        - Local    : ISI dengan path gambar custom milikmu, contoh:
//                     taruh file di `public/videos/thumbs/intro.jpg`
//                     lalu isi: thumbnail: "/videos/thumbs/intro.jpg"
//   5. `duration` TIDAK perlu diisi — akan dihitung otomatis
//        oleh player saat metadata video dimuat.

export type VideoType = "youtube" | "local" | "instagram";

export interface VideoCategory {
  id: string;
  title: string;
  description?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  type: VideoType;
  src: string;
  thumbnail?: string;
}

export const videoCategories: VideoCategory[] = [
  {
    id: "vlogindo",
    title: "Vlog Bahasa Indonesia",
    description: "Momen seru dan kegiatan harian XI RPL 2.",
  },

  {
    id: "drama",
    title: "Drama Pentas Seni",
    description: "Pentas Seni Drama yang menampilkan bakat akting siswa-siswi XI RPL 2.",
  }
];

export const videos: VideoItem[] = [
  {
    id: "v-1",
    title: "Kelompok 1 ",
    categoryId: "vlogindo",
    type: "youtube",
    src: "https://youtu.com/watch?v=z-wGOQMxqmc",
  },
  {
    id: "v-2",
    title: "Kelompok 2",
    categoryId: "vlogindo",
    type: "youtube",
    src: "https://www.youtube.com/watch?v=2ABgIFB7_tA",
  },
  {
    id: "v-3",
    title: "Kelompok 3",
    categoryId: "vlogindo",
    type: "youtube",
    src: "https://www.youtube.com/watch?v=SJlYNahXIfI",
  },
  {
    id: "v-4",
    title: "Kelompok 5",
    categoryId: "vlogindo",
    type: "youtube",
    src: "https://www.youtube.com/watch?v=f01bKvdiePE",
  },

  {
    id: "v-5",
    title: "Drama PART 1",
    categoryId: "drama",
    type: "youtube",
    src: "https://www.youtube.com/watch?v=bH9v2lqKumw&t=15594s",
  },

  {
    id: "v-6",
    title: "Drama PART 2",
    categoryId: "drama",
    type: "youtube",
    src: "https://www.youtube.com/watch?v=cezR1sPCERg&t=2174s",
  }


];

export const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1).split("/")[0] || null;
    }
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => ["embed", "shorts", "v"].includes(p));
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
  } catch {
  }
  return null;
};

export const getYouTubeThumbnail = (url: string): string | null => {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
};

export const getInstagramEmbedUrl = (url: string): string => {
  const clean = url.replace(/\/+$/, "");
  return `${clean}/embed`;
};

export const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};
