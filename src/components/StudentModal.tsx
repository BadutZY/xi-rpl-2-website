import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Github, Twitter, Youtube, Gamepad2, Linkedin, Globe } from "lucide-react";
import { Student } from "@/data/students";

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
}

function getSocialUrl(platform: string, handle: string): string {
  if (handle.startsWith("http")) return handle;
  const cleanHandle = handle.replace("@", "");
  switch (platform) {
    case "instagram": return `https://www.instagram.com/${cleanHandle}/`;
    case "github": return `https://github.com/${cleanHandle}`;
    case "twitter": return `https://x.com/${cleanHandle}`;
    case "linkedin": return `https://www.linkedin.com/in/${cleanHandle}`;
    case "youtube": return `https://www.youtube.com/@${cleanHandle}`;
    case "tiktok": return `https://www.tiktok.com/@${cleanHandle}`;
    case "website": return `https://${cleanHandle}`;
    default: return handle;
  }
}

function getSocialIcon(platform: string) {
  switch (platform) {
    case "instagram": return <Instagram size={18} />;
    case "github": return <Github size={18} />;
    case "twitter": return <Twitter size={18} />;
    case "linkedin": return <Linkedin size={18} />;
    case "youtube": return <Youtube size={18} />;
    case "game": return <Gamepad2 size={18} />;
    case "website": return <Globe size={18} />;
    default: return null;
  }
}

const StudentModal = ({ student, onClose }: StudentModalProps) => {
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {student && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="modal-content-box rounded-2xl p-6 md:p-8 max-w-md w-full relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              {/* Photo or placeholder */}
              <div className="w-28 h-36 mx-auto rounded-xl overflow-hidden student-photo-placeholder mb-4 flex items-center justify-center">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.fullName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <svg className="w-16 h-16 text-muted-foreground/40" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              <h3 className="text-xl font-bold font-heading gradient-text mb-1">
                {student.fullName}
              </h3>
              <p className="text-primary text-sm mb-4">{student.position}</p>

              <div className="text-sm text-muted-foreground mb-6 inline-block text-left">
                <table className="border-separate" style={{ borderSpacing: "0 4px" }}>
                  <tbody>
                    <tr>
                      <td className="pr-2 whitespace-nowrap">Nomor Absen</td>
                      <td className="px-2">:</td>
                      <td>{student.no}</td>
                    </tr>
                    <tr>
                      <td className="pr-2 whitespace-nowrap">Umur</td>
                      <td className="px-2">:</td>
                      <td>{student.age > 0 ? `${student.age} tahun` : "-"}</td>
                    </tr>
                    <tr>
                      <td className="pr-2 whitespace-nowrap">Tanggal Lahir</td>
                      <td className="px-2">:</td>
                      <td>{student.birthdate}</td>
                    </tr>
                    <tr>
                      <td className="pr-2 whitespace-nowrap">Kredit Poin</td>
                      <td className="px-2">:</td>
                      <td>{student.kreditPoin}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Sosial Media</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {Object.entries(student.socials).map(([platform, handle]) => {
                    if (!handle || handle === "-") return null;
                    const icon = getSocialIcon(platform);
                    if (!icon) return null;
                    return (
                      <a
                        key={platform}
                        href={getSocialUrl(platform, handle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={handle}
                        className="social-icon-link w-10 h-10 rounded-lg flex items-center justify-center text-foreground hover:text-primary"
                      >
                        {icon}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StudentModal;
