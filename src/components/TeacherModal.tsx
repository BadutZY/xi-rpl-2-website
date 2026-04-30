import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  GraduationCap,
  Instagram,
  Github,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
} from "lucide-react";
import type { Teacher } from "@/data/teachers";
import { useScrollLock } from "@/hooks/use-scroll-lock";

interface Props {
  teacher: Teacher | null;
  onClose: () => void;
}

function getSocialUrl(platform: string, handle: string): string {
  if (handle.startsWith("http")) return handle;
  const c = handle.replace("@", "");
  switch (platform) {
    case "instagram": return `https://www.instagram.com/${c}/`;
    case "github":    return `https://github.com/${c}`;
    case "twitter":   return `https://x.com/${c}`;
    case "linkedin":  return `https://www.linkedin.com/in/${c}`;
    case "youtube":   return `https://www.youtube.com/@${c}`;
    case "tiktok":    return `https://www.tiktok.com/@${c}`;
    case "website":   return `https://${c}`;
    default:          return handle;
  }
}

function getSocialIcon(platform: string): React.ReactElement | null {
  switch (platform) {
    case "instagram": return <Instagram size={18} />;
    case "github":    return <Github size={18} />;
    case "twitter":   return <Twitter size={18} />;
    case "linkedin":  return <Linkedin size={18} />;
    case "youtube":   return <Youtube size={18} />;
    case "website":   return <Globe size={18} />;
    default:          return null;
  }
}

const TeacherModal = ({ teacher, onClose }: Props) => {
  useScrollLock(teacher !== null);

  const overlay = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const hasSocials =
    teacher?.socials != null &&
    Object.values(teacher.socials).some((h) => h && h !== "-");

  return (
    <AnimatePresence>
      {teacher && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={overlay}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="modal-content-box rounded-2xl p-6 md:p-8 max-w-md w-full relative"
          >
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <div className="w-28 h-36 mx-auto rounded-xl overflow-hidden teacher-photo-placeholder mb-4 flex items-center justify-center">
                {teacher.photo ? (
                  <img
                    src={teacher.photo}
                    alt={teacher.fullName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <GraduationCap size={56} className="text-orange-300/70" />
                )}
              </div>

              <h3 className="text-xl font-bold font-heading gradient-text-teacher mb-1">
                {teacher.fullName}
              </h3>
              <p className="text-orange-300 text-sm mb-5">{teacher.role}</p>

              <div className="text-sm text-muted-foreground inline-block text-left">
                <table
                  className="border-separate"
                  style={{ borderSpacing: "0 4px" }}
                >
                  <tbody>
                    <tr>
                      <td className="pr-2 whitespace-nowrap">Umur</td>
                      <td className="px-2">:</td>
                      <td>
                        {teacher.age && teacher.age > 0
                          ? `${teacher.age} tahun`
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="pr-2 whitespace-nowrap">Tanggal Lahir</td>
                      <td className="px-2">:</td>
                      <td>{teacher.birthdate}</td>
                    </tr>
                    <tr>
                      <td className="pr-2 whitespace-nowrap">Mata Pelajaran</td>
                      <td className="px-2">:</td>
                      <td>{teacher.subject}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {hasSocials && (
                <div className="mt-6">
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                    Sosial Media
                  </p>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {Object.entries(teacher.socials!).map(
                      ([platform, handle]) => {
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
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeacherModal;