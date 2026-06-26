import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Loader2,
} from "lucide-react";
import {
  formatDuration,
  getYouTubeId,
  type VideoItem,
} from "@/data/videos";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

async function requestOrientation(orientation: "landscape" | "portrait" = "landscape") {
  const isMobile = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
  if (!isMobile) return;
  try {
    const lockValue = orientation === "portrait" ? "portrait" : "landscape";
    await (screen.orientation as unknown as { lock?: (o: string) => Promise<void> })
      ?.lock?.(lockValue);
  } catch {
  }
}

function unlockOrientation() {
  try {
    (screen.orientation as unknown as { unlock?: () => void })?.unlock?.();
  } catch {
  }
}

function InstagramEmbed({ url, title }: { url: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const injectEmbed = () => {
      if (!containerRef.current) return;

      containerRef.current.innerHTML = "";

      const blockquote = document.createElement("blockquote");
      blockquote.className = "instagram-media";
      blockquote.setAttribute("data-instgrm-permalink", url);
      blockquote.setAttribute("data-instgrm-version", "14");
      blockquote.style.cssText =
        "background:#FFF;border:0;border-radius:3px;box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15);margin:0 auto;max-width:540px;width:100%;";
      containerRef.current.appendChild(blockquote);

      if (window.instgrm) {
        window.instgrm.Embeds.process();
        setLoaded(true);
        return;
      }

      const existingScript = document.getElementById("instagram-embed-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "instagram-embed-script";
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          window.instgrm?.Embeds.process();
          setLoaded(true);
        };
        document.body.appendChild(script);
      } else {
        const retry = setInterval(() => {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
            setLoaded(true);
            clearInterval(retry);
          }
        }, 200);
        return () => clearInterval(retry);
      }
    };

    const t = setTimeout(injectEmbed, 80);
    return () => clearTimeout(t);
  }, [url]);

  return (
    <div className="relative w-full bg-[#0d0d0f] rounded-xl overflow-hidden flex flex-col items-center justify-start">
      {/* Loading state */}
      {!loaded && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 w-full">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "rgba(193,53,132,0.5)", borderTopColor: "transparent" }}
          />
          <span className="text-sm text-white/30 tracking-wide">Memuat {title}…</span>
        </div>
      )}
      {/* Instagram injects its iframe into this div via embed.js */}
      <div ref={containerRef} className="w-full max-w-[540px] mx-auto py-4 px-2" />
    </div>
  );
}

function YouTubePlayer({ video, autoPlay }: { video: VideoItem; autoPlay: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const id = getYouTubeId(video.src);

  useEffect(() => {
    const onFsChange = () => {
      const inFs = document.fullscreenElement === wrapperRef.current;
      setIsFullscreen(inFs);
      if (!inFs) {
        unlockOrientation();
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!wrapperRef.current) return;
    if (document.fullscreenElement) {
      unlockOrientation();
      await document.exitFullscreen();
    } else {
      await wrapperRef.current.requestFullscreen();
      await requestOrientation("landscape");
    }
  };

  if (!id) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center text-muted-foreground">
        URL YouTube tidak valid
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden"
    >
      <iframe
        className="w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      {/* Custom fullscreen button overlay for mobile auto-landscape */}
      <button
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Keluar fullscreen" : "Fullscreen"}
        className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white transition sm:hidden"
      >
        {isFullscreen ? (
          <Minimize className="w-4 h-4" />
        ) : (
          <Maximize className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

interface Props {
  video: VideoItem;
  autoPlay?: boolean;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const VideoPlayer = ({ video, autoPlay = true }: Props) => {
  if (video.type === "youtube") {
    return <YouTubePlayer video={video} autoPlay={autoPlay} />;
  }

  if (video.type === "instagram") {
    return <InstagramEmbed url={video.src} title={video.title} />;
  }

  return <LocalPlayer video={video} autoPlay={autoPlay} />;
};

function LocalPlayer({ video, autoPlay }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimerRef = useRef<number | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(true);
  const [seekHover, setSeekHover] = useState<number | null>(null);

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 2500);
  }, []);

  const reveal = useCallback(() => {
    setShowControls(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => { setPlaying(true); scheduleHide(); };
    const onPause = () => { setPlaying(false); setShowControls(true); };
    const onTime = () => setCurrent(v.currentTime);
    const onLoaded = () => { setDuration(v.duration); setLoading(false); };
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    const onProgress = () => {
      if (v.buffered.length > 0) setBuffered(v.buffered.end(v.buffered.length - 1));
    };
    const onVol = () => { setMuted(v.muted); setVolume(v.volume); };
    const onEnd = () => { setPlaying(false); setShowControls(true); };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("progress", onProgress);
    v.addEventListener("volumechange", onVol);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("progress", onProgress);
      v.removeEventListener("volumechange", onVol);
      v.removeEventListener("ended", onEnd);
    };
  }, [scheduleHide]);

  useEffect(() => {
    const onFs = () => {
      const inFs = document.fullscreenElement === wrapperRef.current;
      setFullscreen(inFs);
      if (!inFs) {
        unlockOrientation();
      }
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const v = videoRef.current;
      if (!v) return;
      if (e.key === " " || e.key === "k") { e.preventDefault(); togglePlay(); }
      else if (e.key === "m") toggleMute();
      else if (e.key === "f") toggleFullscreen();
      else if (e.key === "ArrowRight") { v.currentTime = Math.min(v.duration, v.currentTime + 5); reveal(); }
      else if (e.key === "ArrowLeft") { v.currentTime = Math.max(0, v.currentTime - 5); reveal(); }
      else if (e.key === "ArrowUp") { v.volume = Math.min(1, v.volume + 0.1); reveal(); }
      else if (e.key === "ArrowDown") { v.volume = Math.max(0, v.volume - 0.1); reveal(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
    reveal();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    reveal();
  };

  const toggleFullscreen = async () => {
    if (!wrapperRef.current) return;
    if (document.fullscreenElement) {
      unlockOrientation();
      await document.exitFullscreen();
    } else {
      await wrapperRef.current.requestFullscreen();
      await requestOrientation(video.orientation ?? "landscape");
    }
  };

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * duration;
  };

  const onSeekHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setSeekHover(ratio * duration);
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(e.target.value);
    v.volume = val;
    v.muted = val === 0;
  };

  const setPlaybackSpeed = (s: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = s;
    setSpeed(s);
    setShowSettings(false);
  };

  const progress = duration ? (current / duration) * 100 : 0;
  const bufferedPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none"
      onMouseMove={reveal}
      onMouseLeave={() => { if (playing) setShowControls(false); }}
      onClick={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "VIDEO") togglePlay();
      }}
    >
      <video
        ref={videoRef}
        src={video.src}
        className="absolute inset-0 w-full h-full"
        autoPlay={autoPlay}
        playsInline
      />

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-12 h-12 text-white/90 animate-spin" />
        </div>
      )}

      {/* Big center play button when paused */}
      <AnimatePresence>
        {!playing && !loading && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-colors"
            aria-label="Play"
          >
            <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom gradient + controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-0 bottom-0 pt-16 pb-2 px-3 sm:px-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress / seek bar */}
            <div
              onClick={onSeek}
              onMouseMove={onSeekHover}
              onMouseLeave={() => setSeekHover(null)}
              className="relative h-1.5 hover:h-2 transition-all bg-white/25 rounded-full cursor-pointer group/seek"
            >
              <div
                className="absolute inset-y-0 left-0 bg-white/40 rounded-full"
                style={{ width: `${bufferedPct}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${progress}%`, background: "rgb(239, 68, 68)" }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-red-500 opacity-0 group-hover/seek:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 7px)` }}
              />
              {seekHover !== null && (
                <div
                  className="absolute -top-7 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/85 text-white text-[10px] font-mono pointer-events-none"
                  style={{ left: `${(seekHover / Math.max(duration, 1)) * 100}%` }}
                >
                  {formatDuration(seekHover)}
                </div>
              )}
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-2 sm:gap-3 mt-2 text-white">
              <button onClick={togglePlay} className="hover:text-red-400 transition" aria-label={playing ? "Pause" : "Play"}>
                {playing ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6" fill="currentColor" />}
              </button>

              <div className="flex items-center gap-1 group/vol">
                <button onClick={toggleMute} className="hover:text-red-400 transition" aria-label="Mute">
                  {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={onVolumeChange}
                  className="w-0 group-hover/vol:w-20 transition-all duration-200 accent-red-500 cursor-pointer h-1"
                />
              </div>

              <div className="text-xs sm:text-sm font-mono tabular-nums">
                {formatDuration(current)} <span className="text-white/60">/ {formatDuration(duration)}</span>
              </div>

              <div className="flex-1" />

              <div className="relative">
                <button
                  onClick={() => setShowSettings((s) => !s)}
                  className="hover:text-red-400 transition"
                  aria-label="Settings"
                >
                  <Settings className={`w-5 h-5 transition-transform ${showSettings ? "rotate-45" : ""}`} />
                </button>
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute bottom-8 right-0 w-40 rounded-lg bg-black/95 border border-white/10 shadow-xl py-1 text-sm"
                    >
                      <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-white/50">
                        Kecepatan
                      </div>
                      {SPEEDS.map((s) => (
                        <button
                          key={s}
                          onClick={() => setPlaybackSpeed(s)}
                          className={`w-full text-left px-3 py-1.5 hover:bg-white/10 transition ${
                            s === speed ? "text-red-400" : "text-white"
                          }`}
                        >
                          {s === 1 ? "Normal" : `${s}x`}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={toggleFullscreen} className="hover:text-red-400 transition" aria-label="Fullscreen">
                {fullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default VideoPlayer;