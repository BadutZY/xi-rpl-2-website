import { useEffect, useState } from "react";
import { getYouTubeId, type VideoItem } from "@/data/videos";

// Loads YouTube IFrame API once (browser only).
let ytApiPromise: Promise<void> | null = null;
const loadYouTubeAPI = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  // @ts-expect-error - YT injected by script
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise<void>((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    // @ts-expect-error - global callback expected by YT script
    const prev = window.onYouTubeIframeAPIReady;
    // @ts-expect-error - assign global
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === "function") prev();
      resolve();
    };
  });
  return ytApiPromise;
};

/**
 * Returns duration (in seconds) of a video, auto-detected from metadata.
 * - youtube  -> via YouTube IFrame Player API (offscreen player)
 * - local    -> via hidden <video preload="metadata">
 * - instagram-> not available reliably; returns null
 */
export const useVideoDuration = (video: VideoItem): number | null => {
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setDuration(null);

    if (video.type === "local") {
      const el = document.createElement("video");
      el.preload = "metadata";
      el.muted = true;
      el.src = video.src;
      const onLoaded = () => {
        if (!cancelled) setDuration(el.duration);
        el.removeAttribute("src");
        el.load();
      };
      el.addEventListener("loadedmetadata", onLoaded, { once: true });
      el.addEventListener("error", () => !cancelled && setDuration(0), { once: true });
      return () => {
        cancelled = true;
        el.removeEventListener("loadedmetadata", onLoaded);
      };
    }

    if (video.type === "youtube") {
      const id = getYouTubeId(video.src);
      if (!id) return;

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = "1px";
      container.style.height = "1px";
      document.body.appendChild(container);

      let player: { destroy?: () => void } | null = null;

      loadYouTubeAPI().then(() => {
        if (cancelled) return;
        // @ts-expect-error YT global
        player = new window.YT.Player(container, {
          videoId: id,
          host: "https://www.youtube-nocookie.com",
          playerVars: { controls: 0, autoplay: 0, mute: 1 },
          events: {
            onReady: (e: { target: { getDuration: () => number } }) => {
              const d = e.target.getDuration();
              if (!cancelled) setDuration(d);
              try {
                player?.destroy?.();
              } catch { /* noop */ }
              container.remove();
            },
            onError: () => {
              if (!cancelled) setDuration(0);
              container.remove();
            },
          },
        });
      });

      return () => {
        cancelled = true;
        try { player?.destroy?.(); } catch { /* noop */ }
        if (container.parentNode) container.remove();
      };
    }

    // instagram: no reliable way to get duration without API
    setDuration(0);
  }, [video.id, video.type, video.src]);

  return duration;
};
