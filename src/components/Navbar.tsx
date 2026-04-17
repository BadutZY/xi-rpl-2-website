import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/#home", label: "Home", hash: "home" },
  { to: "/#about", label: "About", hash: "about" },
  { to: "/#technologies", label: "Lessons", hash: "technologies" },
  { to: "/students", label: "Students", hash: "" },
  { to: "/schedule", label: "Schedules", hash: "" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (to: string, hash: string) => {
    setMobileOpen(false);
    if (hash && location.pathname === "/") {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
  };

  return (
    <header className="nav-header sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/#home" className="text-2xl font-bold gradient-text font-heading">
            XI RPL 2
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => handleNavClick(link.to, link.hash)}
                className="text-muted-foreground hover:text-secondary font-medium transition-colors text-sm tracking-wide uppercase"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg filter-btn"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="flex flex-col items-center py-4 space-y-4 rounded-lg" style={{ background: "hsla(222, 47%, 11%, 0.95)", backdropFilter: "blur(12px)" }}>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => handleNavClick(link.to, link.hash)}
                      className="text-foreground hover:text-secondary transition-colors text-lg font-semibold"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
