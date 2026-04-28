import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoSrc from "@/assets/logo.png";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const steps = [
      { target: 25, delay: 0,     duration: 350 },
      { target: 55, delay: 350,   duration: 400 },
      { target: 80, delay: 750,   duration: 350 },
      { target: 100, delay: 1100, duration: 250 },
    ];

    let current = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach(({ target, delay, duration }) => {
      const t = setTimeout(() => {
        const start = current;
        const startTime = performance.now();
        const tick = (now: number) => {
          const elapsed = now - startTime;
          const ratio = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - ratio, 3);
          current = Math.round(start + (target - start) * eased);
          setProgress(current);
          if (ratio < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, delay);
      timers.push(t);
    });

    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete?.(), 600);
    }, 1800);
    timers.push(hideTimer);

    return () => timers.forEach(clearTimeout);
  }, []);

  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3.5 + 2,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "oklch(0.205 0.04 264)",
            overflow: "hidden",
          }}
        >
          {/* Radial glow */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 70% 55% at 50% 50%, hsla(263, 70%, 50%, 0.13) 0%, transparent 70%)",
          }} />

          {/* Partikel */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              animate={{ y: [0, -18, 0], opacity: [0.12, 0.45, 0.12] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                left: `${p.x}%`, top: `${p.y}%`,
                width: p.size, height: p.size,
                borderRadius: "50%", pointerEvents: "none",
                background: p.id % 3 === 0
                  ? "hsl(263, 70%, 65%)"
                  : p.id % 3 === 1
                  ? "hsl(160, 84%, 55%)"
                  : "hsl(263, 70%, 45%)",
              }}
            />
          ))}

          {/* Garis atas */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3, transformOrigin: "left",
              background: "linear-gradient(90deg, transparent, hsl(263, 70%, 55%), hsl(160, 84%, 45%), transparent)",
            }}
          />

          {/* Konten utama */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 30, zIndex: 1, padding: "0 24px", width: "100%", maxWidth: 480,
          }}>

            {/* LOGO */}
            <motion.div
              initial={{ opacity: 0, scale: 0.55, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {/* Ring luar berputar */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute", width: 164, height: 164, borderRadius: "50%",
                  border: "1.5px solid transparent",
                  background: "linear-gradient(oklch(0.205 0.04 264), oklch(0.205 0.04 264)) padding-box, linear-gradient(135deg, hsl(263, 70%, 55%), hsl(160, 84%, 45%), hsl(263, 70%, 55%)) border-box",
                }}
              />
              {/* Ring dalam berlawanan */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute", width: 142, height: 142, borderRadius: "50%",
                  border: "1px solid transparent",
                  background: "linear-gradient(oklch(0.205 0.04 264), oklch(0.205 0.04 264)) padding-box, linear-gradient(225deg, hsla(263, 70%, 55%, 0.4), hsla(160, 84%, 45%, 0.4), hsla(263, 70%, 55%, 0.4)) border-box",
                }}
              />

              {/* img langsung, objectFit contain, ukuran fix */}
              <img
                src={logoSrc}
                alt="Logo XI RPL 2"
                width={110}
                height={110}
                style={{
                  objectFit: "contain",
                  display: "block",
                  filter: "drop-shadow(0 0 16px hsla(263, 70%, 50%, 0.5))",
                }}
              />
            </motion.div>

            {/* Teks */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ textAlign: "center" }}
            >
              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 700,
                margin: 0, lineHeight: 1.2, color: "oklch(0.984 0.003 247.858)",
              }}>
                SMK INFOKOM
              </h1>
              <p style={{
                margin: "6px 0 0", fontSize: "clamp(13px, 3vw, 16px)",
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
                background: "linear-gradient(135deg, hsl(263, 70%, 70%), hsl(160, 84%, 55%))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", letterSpacing: "0.05em",
              }}>
                XI RPL 2
              </p>
              <p style={{
                margin: "8px 0 0", fontSize: "clamp(11px, 2.5vw, 13px)",
                color: "oklch(0.72 0.02 256)", fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.04em",
              }}>
                Rekayasa Perangkat Lunak
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              style={{ width: "100%", maxWidth: 300 }}
            >
              <div style={{
                width: "100%", height: 4, borderRadius: 99,
                background: "oklch(0.28 0.03 260)", overflow: "hidden", position: "relative",
              }}>
                <div style={{
                  height: "100%", borderRadius: 99,
                  background: "linear-gradient(90deg, hsl(263, 70%, 55%), hsl(160, 84%, 45%))",
                  width: `${progress}%`, transition: "width 0.25s ease-out",
                }} />
                <motion.div
                  animate={{ x: ["-100%", "500%"] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: 0.5 }}
                  style={{
                    position: "absolute", top: 0, left: 0, width: "25%", height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 9 }}>
                <span style={{
                  fontSize: 11, color: "oklch(0.72 0.02 256)", fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>
                  Memuat...
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                  background: "linear-gradient(135deg, hsl(263, 70%, 70%), hsl(160, 84%, 55%))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  {progress}%
                </span>
              </div>
            </motion.div>

            {/* Dot bouncing */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              style={{ display: "flex", gap: 8 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.22, ease: "easeInOut" }}
                  style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: i === 1 ? "hsl(160, 84%, 55%)" : "hsl(263, 70%, 65%)",
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Garis bawah */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 3, transformOrigin: "right",
              background: "linear-gradient(90deg, transparent, hsl(160, 84%, 45%), hsl(263, 70%, 55%), transparent)",
            }}
          />

          {/* Corner decorations */}
          {[
            { top: 24, left: 24, borderTop: true, borderLeft: true },
            { top: 24, right: 24, borderTop: true, borderRight: true },
            { bottom: 24, left: 24, borderBottom: true, borderLeft: true },
            { bottom: 24, right: 24, borderBottom: true, borderRight: true },
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              style={{
                position: "absolute", width: 20, height: 20,
                top: pos.top, right: (pos as any).right, bottom: (pos as any).bottom, left: (pos as any).left,
                borderTop: pos.borderTop ? "2px solid hsla(263, 70%, 55%, 0.45)" : undefined,
                borderBottom: pos.borderBottom ? "2px solid hsla(160, 84%, 45%, 0.45)" : undefined,
                borderLeft: pos.borderLeft ? "2px solid hsla(263, 70%, 55%, 0.45)" : undefined,
                borderRight: pos.borderRight ? "2px solid hsla(160, 84%, 45, 0.45)" : undefined,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}