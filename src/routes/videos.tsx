import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Video as VideoIcon, Folder, FolderOpen, Youtube, Instagram, FileVideo, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoModal from "@/components/VideoModal";
import {
  videos,
  videoCategories,
  formatDuration,
  getYouTubeThumbnail,
  type VideoItem,
} from "@/data/videos";
import { useVideoDuration } from "@/hooks/useVideoDuration";

const STORAGE_KEY = "xirpl2:shownFolders";

export const Route = createFileRoute("/videos")({
  component: VideosPage,
  head: () => ({
    meta: [
      { title: "Video - XI RPL 2" },
      { name: "description", content: "Koleksi video kegiatan dan pembelajaran kelas XI RPL 2." },
      { property: "og:title", content: "Video — XI RPL 2" },
    ],
  }),
});

function VideosPage() {
  const grouped = useMemo(
    () =>
      videoCategories.map((cat) => ({
        category: cat,
        items: videos.filter((v) => v.categoryId === cat.id),
      })),
    [],
  );

  // Default: ALL folders hidden. User must click to show.
  const [shown, setShown] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [active, setActive] = useState<VideoItem | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setShown(new Set(JSON.parse(raw) as string[]));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...shown]));
    } catch { /* ignore */ }
  }, [shown, hydrated]);

  const toggleFolder = (id: string) => {
    setShown((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const shownCategories = grouped.filter(({ category }) => shown.has(category.id));

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-4 rounded-2xl mb-6"
            style={{
              background: "linear-gradient(135deg, hsla(263, 70%, 50%, 0.15), hsla(160, 84%, 39%, 0.15))",
              border: "1px solid hsla(263, 70%, 50%, 0.25)",
            }}
          >
            <VideoIcon size={40} className="text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4"
          >
            <span className="text-foreground">Koleksi </span>
            <span className="gradient-text">Video</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Pilih folder di bawah untuk menampilkan isinya.
          </motion.p>
        </div>

        {/* Folder grid — 2 / 3 / 4 / 5 per row depending on screen size */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-12">
          {grouped.map(({ category, items }, i) => {
            const isShown = shown.has(category.id);
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                onClick={() => toggleFolder(category.id)}
                aria-pressed={isShown}
                className={`group relative text-left rounded-2xl p-4 border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                  isShown ? "bg-secondary/10 border-secondary/40" : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                      isShown ? "bg-secondary/20 text-secondary" : "bg-white/5 text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {isShown ? <FolderOpen size={22} /> : <Folder size={22} />}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full transition ${
                      isShown ? "bg-secondary/15 text-secondary" : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    {isShown ? <><EyeOff size={11} /> Hide</> : <><Eye size={11} /> Show</>}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground line-clamp-1">{category.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{items.length} video</p>
              </motion.button>
            );
          })}
        </div>

        {/* Shown folders' contents */}
        <div className="space-y-12">
          <AnimatePresence initial={false}>
            {shownCategories.map(({ category, items }) => (
              <motion.section
                key={category.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="flex items-end justify-between mb-5 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FolderOpen className="text-secondary flex-shrink-0" size={24} />
                    <div className="min-w-0">
                      <h2 className="text-xl md:text-2xl font-bold font-heading gradient-text truncate">
                        {category.title}
                      </h2>
                      {category.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFolder(category.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition flex-shrink-0 cursor-pointer"
                  >
                    <EyeOff size={13} /> Sembunyikan
                  </button>
                </div>

                {items.length === 0 ? (
                  <p className="text-muted-foreground text-sm italic">Belum ada video di folder ini.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((v, i) => (
                      <VideoCard key={v.id} video={v} index={i} onPlay={() => setActive(v)} />
                    ))}
                  </div>
                )}
              </motion.section>
            ))}
          </AnimatePresence>

          {shownCategories.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-10 border border-dashed border-white/10 rounded-2xl">
              Tidak ada folder yang ditampilkan. Klik salah satu folder di atas untuk melihat isinya.
            </div>
          )}
        </div>
      </main>

      <Footer />

      <VideoModal video={active} onClose={() => setActive(null)} />
    </div>
  );
}

function VideoCard({ video, index, onPlay }: { video: VideoItem; index: number; onPlay: () => void }) {
  const duration = useVideoDuration(video);
  const thumb =
    video.thumbnail ?? (video.type === "youtube" ? getYouTubeThumbnail(video.src) : null);
  const TypeIcon =
    video.type === "youtube" ? Youtube : video.type === "instagram" ? Instagram : FileVideo;
  const typeLabel =
    video.type === "youtube" ? "YouTube" : video.type === "instagram" ? "Instagram" : "Video";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
        <button
          type="button"
          onClick={onPlay}
          className="block w-full text-left group relative rounded-2xl overflow-hidden border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
      >
        <div className="relative aspect-video bg-black overflow-hidden">
          {thumb ? (
            <img
              src={thumb}
              alt={video.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <TypeIcon className="w-12 h-12 text-white/60" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-red-600/90 backdrop-blur flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
              <Play className="w-7 h-7 text-white ml-0.5" fill="currentColor" />
            </div>
          </div>

          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/85 text-white text-xs font-mono">
            {duration === null ? "…" : duration > 0 ? formatDuration(duration) : "LIVE"}
          </div>

          <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur text-white text-[11px] font-medium">
            <TypeIcon className="w-3 h-3" /> {typeLabel}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-secondary transition-colors">
            {video.title}
          </h3>
          {video.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{video.description}</p>
          )}
        </div>
      </button>
    </motion.div>
  );
}
