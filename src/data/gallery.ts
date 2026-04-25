import photo1 from "@/assets/hero-class.jpeg";
import batik from "@/assets/gallery/batik.jpeg";
import batik2 from "@/assets/gallery/batik2.jpeg";
import batik3 from "@/assets/gallery/batik3.jpeg";
import juara from "@/assets/gallery/juara.jpeg";
import juara2 from "@/assets/gallery/juara2.jpeg";
import literasi from "@/assets/gallery/literasi.jpeg";
import literasi2 from "@/assets/gallery/literasi2.jpeg";
import mabar from "@/assets/gallery/mabar.jpeg";
import ngumpul from "@/assets/gallery/ngumpul.jpeg";
import ngumpul2 from "@/assets/gallery/ngumpul2.jpeg";
import ngumpul3 from "@/assets/gallery/ngumpul3.jpeg";
import petugas from "@/assets/gallery/petugas.jpeg";

export interface GalleryImage {
  id: number;
  src: string;
  title: string;
}

export const galleryImages: GalleryImage[] = [
  { id: 1,  src: photo1,  title: " " },
  { id: 2,  src: batik,  title: " " },
  { id: 3,  src: batik2,  title: " " },
  { id: 4,  src: batik3,  title: " " },
  { id: 5,  src: juara,  title: " " },
  { id: 6,  src: juara2,  title: " " },
  { id: 7,  src: literasi,  title: " " },
  { id: 8,  src: literasi2,  title: " " },
  { id: 9,  src: mabar,  title: " " },
  { id: 10, src: ngumpul, title: " " },
  { id: 11, src: ngumpul2, title: " " },
  { id: 12, src: ngumpul3, title: " " },
  { id: 13, src: petugas, title: " " },
];

// Hanya 6 foto yang tampil di section preview homepage
export const galleryPreview = galleryImages.slice(0, 6);