import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Brush, Eye, UserCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScheduleModal from "@/components/ScheduleModal";
import StudentModal from "@/components/StudentModal";
import { studentsData, type Student } from "@/data/students";
import { lessonSchedule, scheduleDetails, piketSchedule, dayNames, dayLabels } from "@/data/schedule";

export const Route = createFileRoute("/schedule")({
  component: SchedulePage,
  head: () => ({
    meta: [
      { title: "Jadwal - XI RPL 2" },
      { name: "description", content: "Jadwal pelajaran dan piket kelas XI RPL 2 SMK INFOKOM." },
      { property: "og:title", content: "Jadwal — XI RPL 2" },
    ],
  }),
});

function SchedulePage() {
  const [activeTab, setActiveTab] = useState<"lesson" | "piket">("lesson");
  const [filterDay, setFilterDay] = useState<string>("all");
  const [modalDay, setModalDay] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredDays = filterDay === "all" ? [...dayNames] : dayNames.filter((d) => d === filterDay);

  const findStudentByName = (fullName: string): Student | null =>
    studentsData.find((s) => s.fullName.toUpperCase() === fullName.toUpperCase()) || null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-heading gradient-text mb-4">Jadwal</h2>
          <p className="text-muted-foreground text-lg">Jadwal kelas XI RPL 2.</p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="toggle-container rounded-full p-1 flex relative">
            <div
              className="toggle-slider-bg absolute top-1 bottom-1 w-[calc(50%-4px)]"
              style={{ transform: activeTab === "piket" ? "translateX(calc(100% + 4px))" : "translateX(2px)" }}
            />
            <button
              onClick={() => { setActiveTab("lesson"); setFilterDay("all"); }}
              className={`toggle-btn px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 relative ${activeTab === "lesson" ? "active" : ""}`}
            >
              <BookOpen size={16} /> Pelajaran
            </button>
            <button
              onClick={() => { setActiveTab("piket"); setFilterDay("all"); }}
              className={`toggle-btn px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 relative ${activeTab === "piket" ? "active" : ""}`}
            >
              <Brush size={16} /> Piket
            </button>
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="md:hidden text-center">
            <select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              className="search-input px-4 py-2 rounded-full text-sm"
            >
              <option value="all">Semua Hari</option>
              {dayNames.map((d) => (
                <option key={d} value={d}>{dayLabels[d]}</option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => setFilterDay("all")}
              className={`filter-btn px-4 py-2 rounded-full text-sm font-medium ${filterDay === "all" ? "active" : ""}`}
            >
              Semua Hari
            </button>
            {dayNames.map((d) => (
              <button
                key={d}
                onClick={() => setFilterDay(d)}
                className={`filter-btn px-4 py-2 rounded-full text-sm font-medium ${filterDay === d ? "active" : ""}`}
              >
                {dayLabels[d]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        {activeTab === "lesson" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDays.map((day, i) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="schedule-card p-6 rounded-xl flex flex-col"
              >
                <h3 className="text-2xl font-heading gradient-text mb-4">{dayLabels[day]}</h3>
                <div className="space-y-3 flex-grow">
                  {lessonSchedule[day].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center gap-2">
                      <span className="time-badge px-3 py-1 rounded-full text-xs">{item.time}</span>
                      <span className="subject-badge px-3 py-1 rounded-full text-xs">{item.subject}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setModalDay(day)}
                  className="btn-detail w-full mt-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Eye size={16} /> Lihat Detail
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDays.map((day, i) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="schedule-card p-6 rounded-xl"
              >
                <h3 className="text-2xl font-heading gradient-text mb-4">{dayLabels[day]}</h3>
                <div className="space-y-3">
                  {piketSchedule[day].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        const found = findStudentByName(item.fullName);
                        if (found) setSelectedStudent(found);
                      }}
                    >
                      <UserCircle size={20} className="text-secondary flex-shrink-0" />
                      <span className="subject-badge px-3 py-1 rounded-full text-xs">
                        {item.fullName} ({item.nickname})
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <ScheduleModal
        isOpen={!!modalDay}
        onClose={() => setModalDay(null)}
        details={modalDay ? scheduleDetails[modalDay] : []}
        dayLabel={modalDay ? dayLabels[modalDay] : ""}
      />
      <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />

      <Footer />
    </div>
  );
}
