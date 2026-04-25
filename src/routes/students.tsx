import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Users, GraduationCap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudentModal from "@/components/StudentModal";
import TeacherModal from "@/components/TeacherModal";
import { studentsData, type Student } from "@/data/students";
import { teachersData, type Teacher } from "@/data/teachers";

export const Route = createFileRoute("/students")({
  component: StudentsPage,
  head: () => ({
    meta: [
      { title: "Daftar - XI RPL 2" },
      { name: "description", content: "Daftar lengkap murid dan guru kelas XI RPL 2 SMK INFOKOM." },
      { property: "og:title", content: "Daftar — XI RPL 2" },
    ],
  }),
});

function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return studentsData;
    const isNumeric = /^\d+$/.test(term);
    return studentsData.filter((s) => {
      const noMatch = isNumeric ? s.no === term : s.no.toLowerCase().includes(term);
      return (
        s.name.toLowerCase().includes(term) ||
        s.fullName.toLowerCase().includes(term) ||
        s.position.toLowerCase().includes(term) ||
        noMatch
      );
    });
  }, [searchTerm]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-4 rounded-2xl mb-6"
            style={{ background: "linear-gradient(135deg, hsla(263, 70%, 50%, 0.15), hsla(160, 84%, 39%, 0.15))", border: "1px solid hsla(263, 70%, 50%, 0.25)" }}
          >
            <Users size={40} className="text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4"
          >
            <span className="text-foreground">Daftar Murid</span>
            <br />
            <span className="gradient-text">XI RPL 2</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8"
          >
            Kenali para calon developer masa depan dari kelas XI RPL 2 SMK INFOKOM.
          </motion.p>
        </div>

        {/* Daftar Guru — section terpisah */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <GraduationCap size={28} className="text-orange-400" />
              <h2 className="text-3xl font-bold font-heading gradient-text-teacher">Wali Kelas</h2>
            </div>
            <p className="text-muted-foreground text-sm">Wali kelas XI RPL 2.</p>
          </div>

          <div className="flex justify-center">
            {teachersData.map((teacher, i) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.3 }}
                onClick={() => setSelectedTeacher(teacher)}
                className="teacher-card rounded-xl p-5 md:p-6 flex items-center gap-5 md:gap-6 w-full max-w-md md:max-w-lg"
              >
                <div className="w-20 h-24 md:w-28 md:h-32 rounded-lg overflow-hidden teacher-photo-placeholder flex items-center justify-center flex-shrink-0">
                  {teacher.photo ? (
                    <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <GraduationCap className="w-10 h-10 md:w-14 md:h-14 text-orange-300/70" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-lg md:text-xl font-bold font-heading gradient-text-teacher mb-1 truncate">{teacher.fullName}</h3>
                  <p className="text-orange-300 text-xs md:text-sm mb-2 truncate">{teacher.role}</p>
                  <p className="text-muted-foreground text-xs md:text-sm truncate">
                    <span className="text-foreground/70">Mapel:</span> {teacher.subject}
                  </p>
                  <div className="mt-3">
                    <div className="w-10 h-1 rounded-full" style={{ background: "var(--gradient-teacher)" }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Search murid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="max-w-md mx-auto relative mb-8"
        >
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama murid..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input w-full pl-12 pr-4 py-3 rounded-full text-sm"
          />
        </motion.div>

        {/* Grid murid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {filtered.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.02, 0.4), duration: 0.3 }}
              onClick={() => setSelectedStudent(student)}
              className="student-card rounded-xl p-4 md:p-6 text-center"
            >
              <div className="w-16 h-20 md:w-24 md:h-28 mx-auto rounded-lg overflow-hidden student-photo-placeholder mb-3 flex items-center justify-center">
                {student.photo ? (
                  <img src={student.photo} alt={student.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <svg className="w-10 h-10 md:w-14 md:h-14 text-muted-foreground/30" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <h3 className="text-sm md:text-lg font-bold font-heading gradient-text mb-1 truncate">{student.name}</h3>
              <p className="text-primary text-xs md:text-sm truncate">{student.position}</p>
              <div className="mt-3 flex justify-center">
                <div className="w-8 h-1 rounded-full" style={{ background: "var(--gradient-primary)" }} />
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      <TeacherModal teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)} />

      <Footer />
    </div>
  );
}
