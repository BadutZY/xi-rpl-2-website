import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap } from "lucide-react";
import { ScheduleDetail } from "@/data/schedule";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: ScheduleDetail[];
  dayLabel: string;
}

const ScheduleModal = ({ isOpen, onClose, details, dayLabel }: ScheduleModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="modal-content-box rounded-2xl p-6 md:p-8 max-w-lg w-full relative max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-heading gradient-text">
                Detail Jadwal
              </h3>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {details.map((item, idx) => (
                <div key={idx} className="modal-lesson-item">
                  <div className="mb-3">
                    <span className="subject-badge px-3 py-1 rounded-full text-sm">
                      {item.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap size={20} className="text-secondary flex-shrink-0" />
                    <span className="text-foreground font-medium text-sm">
                      {item.teacher}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScheduleModal;
