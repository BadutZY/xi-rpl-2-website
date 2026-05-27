import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import type { VideoItem } from "@/data/videos";

interface Props {
  video: VideoItem | null;
  onClose: () => void;
}

const VideoModal = ({ video, onClose }: Props) => {
  // Lock background scroll while open — restore previous value on close
  useEffect(() => {
    if (!video) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollBarComp = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollBarComp > 0) document.body.style.paddingRight = `${scrollBarComp}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [video]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm"
          // Intentionally NO onClick handler — modal can only be closed via the X button
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-5xl"
          >
            {/* Close button — the ONLY way to close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup video"
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black shadow-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <div className="rounded-xl overflow-hidden shadow-2xl bg-black">
              {/* Key by id so changing video remounts player cleanly */}
              <VideoPlayer key={video.id} video={video} />
            </div>

            <div className="mt-3 text-white">
              <h2 className="text-lg sm:text-xl font-bold font-heading">{video.title}</h2>
              {video.description && (
                <p className="mt-1 text-sm text-white/70">{video.description}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default VideoModal;
