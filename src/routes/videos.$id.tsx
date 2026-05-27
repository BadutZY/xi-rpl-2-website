import { useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Youtube, Instagram, FileVideo, Folder } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import {
  videos,
  videoCategories,
  formatDuration,
  getYouTubeThumbnail,
  type VideoItem,
} from "@/data/videos";
import { useVideoDuration } from "@/hooks/useVideoDuration";

export const Route = createFileRoute("/videos/$id")({
  component: WatchPage,
  head: ({ params }) => {
    const v = videos.find((x) => x.id === params.id);
    return {
      meta: [
        { title: v ? `${v.title} — XI RPL 2` : "Video — XI RPL 2" },
        { name: "description", content: v?.description ?? "Tonton video XI RPL 2." },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold gradient-text">Video tidak ditemukan</h1>
        <Link to="/videos" className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground">
          Kembali ke daftar video
        </Link>
      </div>
    </div>
  ),
});

function WatchPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const video = videos.find((v) => v.id === id);

  const category = useMemo(
    () => (video ? videoCategories.find((c) => c.id === video.categoryId) : null),
    [video],
  );

  const related = useMemo(() => {
    if (!video) return [];
    // Same category first, then others
    const same = videos.filter((v) => v.categoryId === video.categoryId && v.id !== video.id);
    const others = videos.filter((v) => v.categoryId !== video.categoryId);
    return [...same, ...others];
  }, [video]);

  if (!video) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold gradient-text">Video tidak ditemukan</h1>
          <Link to="/videos" className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground">
            Kembali ke daftar video
          </Link>
        </div>
      </div>
    );
  }

  const TypeIcon =
    video.type === "youtube" ? Youtube : video.type === "instagram" ? Instagram : FileVideo;
  const typeLabel =
    video.type === "youtube" ? "YouTube" : video.type === "instagram" ? "Instagram" : "Video Lokal";

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-3 sm:px-4 py-6 lg:py-8">
        <button
          onClick={() => navigate({ to: "/videos" })}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary transition mb-4"
        >
          <ArrowLeft size={16} /> Kembali ke daftar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* MAIN */}
          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="shadow-2xl rounded-xl overflow-hidden"
            >
              {/* Keyed by video.id so navigation between videos remounts player cleanly */}
              <VideoPlayer key={video.id} video={video} />
            </motion.div>

            {/* Title + meta */}
            <div className="mt-5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-heading text-foreground">
                {video.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "var(--time-badge-bg)",
                    border: "1px solid var(--time-badge-border)",
                    color: "hsl(263, 80%, 80%)",
                  }}
                >
                  <TypeIcon size={13} /> {typeLabel}
                </span>
                {category && (
                  <Link
                    to="/videos"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium hover:opacity-80 transition"
                    style={{
                      background: "var(--subject-badge-bg)",
                      border: "1px solid var(--subject-badge-border)",
                      color: "hsl(160, 84%, 70%)",
                    }}
                  >
                    <Folder size={13} /> {category.title}
                  </Link>
                )}
              </div>

              {video.description && (
                <div
                  className="mt-4 rounded-xl p-4 text-sm text-muted-foreground"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                >
                  {video.description}
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR — Up next */}
          <aside className="min-w-0">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Video lainnya
            </h2>
            <div className="flex flex-col gap-3">
              {related.length === 0 && (
                <p className="text-sm text-muted-foreground italic">Tidak ada video lain.</p>
              )}
              {related.map((v) => (
                <SidebarItem key={v.id} video={v} />
              ))}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function SidebarItem({ video }: { video: VideoItem }) {
  const duration = useVideoDuration(video);
  const thumb =
    video.thumbnail ?? (video.type === "youtube" ? getYouTubeThumbnail(video.src) : null);
  const cat = videoCategories.find((c) => c.id === video.categoryId);
  const TypeIcon =
    video.type === "youtube" ? Youtube : video.type === "instagram" ? Instagram : FileVideo;

  return (
    <Link
      to="/videos/$id"
      params={{ id: video.id }}
      className="group flex gap-3 rounded-xl p-2 hover:bg-white/[0.04] transition"
    >
      <div className="relative w-40 sm:w-44 aspect-video flex-shrink-0 rounded-lg overflow-hidden bg-black">
        {thumb ? (
          <img
            src={thumb}
            alt={video.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <TypeIcon className="w-7 h-7 text-white/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-white text-[10px] font-mono">
          {duration === null ? "…" : duration > 0 ? formatDuration(duration) : "LIVE"}
        </div>
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-secondary transition">
          {video.title}
        </h3>
        {cat && (
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
            <Folder size={11} /> {cat.title}
          </p>
        )}
        <p className="text-[11px] text-muted-foreground/80 mt-0.5 inline-flex items-center gap-1">
          <TypeIcon size={10} /> {video.type === "youtube" ? "YouTube" : video.type === "instagram" ? "Instagram" : "Video"}
        </p>
      </div>
    </Link>
  );
}
