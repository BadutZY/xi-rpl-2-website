import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDown, Code, Users, CalendarDays, ArrowRight, Database, Cpu } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-class.jpeg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Main Page - XI RPL 2" },
      { name: "description", content: "Website resmi kelas XI RPL 2 SMK INFOKOM — Rekayasa Perangkat Lunak. Kenali murid, guru, dan jadwal pelajaran kami." },
      { property: "og:title", content: "XI RPL 2 — SMK INFOKOM" },
      { property: "og:description", content: "Website resmi kelas XI RPL 2 SMK INFOKOM — Rekayasa Perangkat Lunak." },
    ],
  }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }),
};

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        id="home"
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        <div
          className="hero-bg"
          style={{ ["--hero-image" as string]: `url(${heroImage})` }}
        />
        <div className="hero-overlay" />

        <div className="container mx-auto px-6 z-10 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex p-4 rounded-2xl mb-8"
            style={{ background: "linear-gradient(135deg, hsla(263, 70%, 50%, 0.2), hsla(160, 84%, 39%, 0.2))", border: "1px solid hsla(263, 70%, 50%, 0.35)" }}
          >
            <Code size={40} className="text-secondary" />
          </motion.div>

          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-bold mb-6 font-heading drop-shadow-lg"
          >
            <span className="text-foreground">SMK INFOKOM</span>
            <br />
            <span className="gradient-text">11 RPL 2</span>
          </motion.h1>

          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="text-lg md:text-xl text-foreground/85 max-w-3xl mx-auto mb-10"
          >
            Rekayasa Perangkat Lunak — Membangun masa depan digital dengan kode dan kreativitas.
          </motion.p>

          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/students" className="btn-primary px-8 py-4 rounded-lg font-medium inline-flex items-center justify-center gap-2">
              Lihat Murid
              <ArrowRight size={18} />
            </Link>
            <Link to="/schedule" className="btn-secondary-outline px-8 py-4 rounded-lg font-medium text-center">
              Lihat Jadwal
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <a href="#about" className="text-foreground/70 hover:text-secondary transition-colors">
            <ArrowDown size={28} />
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5 }} className="text-center mb-12"
          >
            <h2 className="text-4xl font-heading gradient-text mb-6">Tentang XI RPL 2</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              XI RPL 2 di SMK Infokom fokus pada pengembangan keterampilan teknis dan kreatif untuk mempersiapkan siswa menjadi profesional di bidang teknologi informasi.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Kurikulum", desc: "Kurikulum dirancang untuk mengajarkan pemrograman, pengembangan web, manajemen database, dan robotik dengan pendekatan praktis dan proyek berbasis industri." },
              { title: "Kegiatan", desc: "Siswa terlibat dalam pelatihan intensif untuk mengasah kemampuan coding dan kolaborasi dalam lingkungan profesional." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="tech-card p-8 rounded-xl"
              >
                <h3 className="text-xl font-heading text-center mb-4 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-center leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section id="technologies" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
              <span className="gradient-text">Pelajaran</span>{" "}
              <span className="text-foreground">yang Kami Pelajari</span>
            </h2>
            <div className="section-divider mx-auto mb-6" />
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Menguasai berbagai teknologi modern untuk membangun aplikasi dan sistem yang inovatif.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Code size={40} className="text-orange-400" />, title: "Web Development", desc: "Membangun website modern dengan Laravel.", tags: [{ label: "Laravel", cls: "lesson-tag-red" }] },
              { icon: <Database size={40} className="text-secondary" />, title: "Database", desc: "Mengelola data dengan sistem database relasional dan non-relasional.", tags: [{ label: "MySQL", cls: "lesson-tag-blue" }, { label: "PhpMyAdmin", cls: "lesson-tag-yellow" }] },
              { icon: <Cpu size={40} className="text-blue-400" />, title: "Robotic", desc: "Perancangan, pembuatan, dan penggunaan robot.", tags: [{ label: "C++", cls: "lesson-tag-blue" }] },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="tech-card rounded-xl p-8 text-center"
              >
                <div className="mb-6 flex justify-center">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4 font-heading text-foreground">{item.title}</h3>
                <p className="text-muted-foreground mb-6">{item.desc}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag.label} className={`lesson-tag ${tag.cls}`}>{tag.label}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section id="quick-access" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
              <span className="gradient-text">Lihat Lainnya</span>
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="tech-card rounded-xl p-8 flex flex-col items-center min-h-[350px] justify-between"
            >
              <div>
                <Users size={100} className="text-primary mx-auto mb-6" style={{ filter: "drop-shadow(0 0 20px hsla(263, 70%, 50%, 0.4))" }} />
                <h3 className="text-2xl font-bold mb-4 font-heading text-center text-foreground">Data Siswa &amp; Guru</h3>
                <p className="text-muted-foreground text-center mb-6">Lihat daftar murid dan guru XI RPL 2.</p>
              </div>
              <Link to="/students" className="btn-primary px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2">
                See the Students <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="tech-card rounded-xl p-8 flex flex-col items-center min-h-[350px] justify-between"
            >
              <div>
                <CalendarDays size={100} className="text-secondary mx-auto mb-6" style={{ filter: "drop-shadow(0 0 20px hsla(160, 84%, 39%, 0.4))" }} />
                <h3 className="text-2xl font-bold mb-4 font-heading text-center text-foreground">Jadwal Pelajaran</h3>
                <p className="text-muted-foreground text-center mb-6">Lihat jadwal pelajaran dan jadwal piket XI RPL 2.</p>
              </div>
              <Link to="/schedule" className="btn-emerald px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2">
                See Schedule <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
