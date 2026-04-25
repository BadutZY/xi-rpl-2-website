import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap } from "lucide-react";
import type { Teacher } from "@/data/teachers";
import { useScrollLock } from "@/hooks/use-scroll-lock";

interface Props {
  teacher: Teacher | null;
  onClose: () => void;
}

const TeacherModal = ({ teacher, onClose }: Props) => {
  useScrollLock(teacher !== null);

  const overlay = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {teacher && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
            <button onClick={onClose} aria-label="Tutup" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer">
              <X size={24} />
            </button>

            <div className="text-center">
              <div className="w-28 h-36 mx-auto rounded-xl overflow-hidden teacher-photo-placeholder mb-4 flex items-center justify-center">
                {teacher.photo ? (
                  <img src={teacher.photo} alt={teacher.fullName} className="w-full h-full object-cover object-top" />
                ) : (
                  <GraduationCap size={56} className="text-orange-300/70" />
                )}
              </div>

              <h3 className="text-xl font-bold font-heading gradient-text-teacher mb-1">{teacher.fullName}</h3>
              <p className="text-orange-300 text-sm mb-5">{teacher.role}</p>

              <div className="text-sm text-muted-foreground inline-block text-left">
                <table className="border-separate" style={{ borderSpacing: "0 4px" }}>
                  <tbody>
                    <tr>
                      <td className="pr-2 whitespace-nowrap">Umur</td>
                      <td className="px-2">:</td>
                      <td>{teacher.age && teacher.age > 0 ? `${teacher.age} tahun` : "-"}</td>
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeacherModal;