import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect, useRef, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Images } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { galleryImages } from "@/data/gallery";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Gallery - XI RPL 2" },
      { name: "description", content: "Galeri foto kelas XI RPL 2 SMK INFOKOM." },
    ],
  }),
});

const useScrollLock = (isLocked: boolean) => {
  const scrollYRef = useRef<number>(0);
  useEffect(() => {
    if (isLocked) {
      scrollYRef.current = window.scrollY;
      const sw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      if (sw > 0) document.body.style.paddingRight = `${sw}px`;
    } else {
      const y = scrollYRef.current;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.paddingRight = "";
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
    }
  }, [isLocked]);
};

const TILTS = [-3.2, 2.5, -1.4, 3.8, -2.6, 4.1, -3.7, 1.8, -2.2, 3.4, -1.1, 4.3];

function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useScrollLock(selectedIndex !== null);

  const goNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % galleryImages.length : null
    );
  }, []);

  const goPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null
    );
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setSelectedIndex((p) => p !== null ? (p + 1) % galleryImages.length : null);
      if (e.key === "ArrowLeft")  setSelectedIndex((p) => p !== null ? (p - 1 + galleryImages.length) % galleryImages.length : null);
      if (e.key === "Escape")     setSelectedIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Page Header */}
      <section className="py-16 md:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary blur-[200px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex p-4 rounded-2xl mb-6"
            style={{
              background: "linear-gradient(135deg, hsla(263, 70%, 50%, 0.2), hsla(160, 84%, 39%, 0.2))",
              border: "1px solid hsla(263, 70%, 50%, 0.35)",
            }}
          >
            <Images size={36} className="text-secondary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-heading gradient-text mb-4"
          >
            Photo Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Momen-momen berharga kelas XI RPL 2
          </motion.p>
        </div>
      </section>

      {/* Polaroid Grid */}
      <section className="pb-28">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16">
          <div className="polaroid-grid">
            {galleryImages.map((img, i) => {
              const tilt = TILTS[i % TILTS.length];
              return (
                <motion.div
                  key={img.id}
                  className="polaroid-item-wrap"
                  initial={{ opacity: 0, y: 24, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.05, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div
                    className="polaroid-card"
                    style={{ "--tilt": `${tilt}deg` } as CSSProperties}
                    onClick={() => setSelectedIndex(i)}
                  >
                    {/* Foto area */}
                    <div className="polaroid-photo-area">
                      <img
                        src={img.src}
                        alt={img.title}
                        loading="lazy"
                        className="polaroid-img"
                      />
                    </div>
                    {/* Caption bawah polaroid */}
                    <div className="polaroid-footer">
                      <span className="polaroid-caption">{img.title}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "var(--modal-overlay)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-muted/60 hover:bg-muted transition-colors z-10 cursor-pointer"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-muted/60 hover:bg-muted transition-colors z-10 cursor-pointer"
              onClick={goPrev}
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>

            {/* Next */}
            <button
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-muted/60 hover:bg-muted transition-colors z-10 cursor-pointer"
              onClick={goNext}
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>

            {/* Image box */}
            <motion.div
              className="modal-content-box rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <motion.img
                key={selectedIndex}
                src={galleryImages[selectedIndex].src}
                alt={galleryImages[selectedIndex].title}
                className="block max-w-full max-h-[75vh] object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18 }}
              />
              <div className="w-full px-6 py-4 flex items-center justify-between gap-4">
                <p className="text-foreground font-medium text-sm md:text-base">
                  {galleryImages[selectedIndex].title}
                </p>
                <span className="text-muted-foreground text-xs shrink-0">
                  {selectedIndex + 1} / {galleryImages.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}