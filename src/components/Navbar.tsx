import { useState, useEffect, type MouseEvent } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/", hash: "about", label: "About" },
  { to: "/", hash: "technologies", label: "Lessons" },
  { to: "/students", label: "Students" },
  { to: "/schedule", label: "Schedules" },
] as const;

const SPY_IDS = ["about", "technologies"] as const;

type NavLink = (typeof navLinks)[number];
type SpyId = (typeof SPY_IDS)[number];

const cleanHash = (hash?: string) => hash?.replace(/^#/, "") ?? "";

const isSpyId = (hash: string): hash is SpyId =>
  SPY_IDS.includes(hash as SpyId);

const getNavbarHeight = (): number => {
  const header = document.querySelector("header.nav-header");
  return header ? header.getBoundingClientRect().height : 72;
};

const scrollToSection = (hash: SpyId, behavior: ScrollBehavior = "smooth") => {
  const section = document.getElementById(hash);
  if (!section) return;
  const offset = getNavbarHeight() + 8;
  window.scrollTo({
    top: Math.max(0, window.scrollY + section.getBoundingClientRect().top - offset),
    behavior,
  });
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("home");
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveHash("");
      return;
    }

    const compute = () => {
      const navbarHeight = getNavbarHeight();
      const triggerLine = navbarHeight + window.innerHeight * 0.45;

      let current = "home";
      for (const id of SPY_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= triggerLine) {
          current = id;
        }
      }

      setActiveHash(current);
    };

    const initialHash = cleanHash(location.hash);
    if (isSpyId(initialHash)) {
      setActiveHash(initialHash);
      requestAnimationFrame(() => {
        scrollToSection(initialHash, "auto");
        requestAnimationFrame(compute);
      });
    } else {
      setActiveHash("home");
      compute();
    }

    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [location.pathname, location.hash]);

  const isLinkActive = (link: NavLink): boolean => {
    if (!("hash" in link)) {
      if (link.to === "/") {
        return location.pathname === "/" && activeHash === "home";
      }
      return location.pathname === link.to;
    }
    if (location.pathname !== "/") return false;
    return activeHash === link.hash;
  };

  const handleLinkClick = (link: NavLink, event: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);

    if (!("hash" in link)) {
      if (link.to === "/") {
        event.preventDefault();
        setActiveHash("home");
        window.history.pushState(null, "", "/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setActiveHash("");
      }
      return;
    }

    if (location.pathname !== "/") {
      setActiveHash(link.hash);
      return;
    }

    event.preventDefault();
    setActiveHash(link.hash);
    window.history.pushState(null, "", `/#${link.hash}`);
    scrollToSection(link.hash);
  };

  return (
    <header className="nav-header sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 relative">
        <div className="flex items-center justify-between">

          {/* Logo + Nama */}
          <button
            onClick={() => {
              setActiveHash("home");
              window.history.pushState(null, "", "/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 focus:outline-none"
            aria-label="Kembali ke Home"
          >
            <img
              src="/logo.png"
              alt="Logo XI RPL 2"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-2xl font-bold gradient-text font-heading">
              XI RPL 2
            </span>
          </button>

          {/* Desktop */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => {
              const linkActive = isLinkActive(link);
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  hash={"hash" in link ? link.hash : undefined}
                  className={`font-medium transition-colors text-sm tracking-wide uppercase cursor-pointer ${
                    linkActive
                      ? "text-secondary"
                      : "text-muted-foreground hover:text-secondary"
                  }`}
                  onClick={(event) => handleLinkClick(link, event)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg filter-btn"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={`hamburger-icon inline-flex ${open ? "open" : ""}`}>
              {open ? <X size={24} /> : <Menu size={24} />}
            </span>
          </button>
        </div>

        {/* Mobile dropdown */}
        <div className={`md:hidden mobile-menu-panel ${open ? "open" : ""}`}>
          <div className="flex flex-col py-2">
            {navLinks.map((link) => {
              const linkActive = isLinkActive(link);
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  hash={"hash" in link ? link.hash : undefined}
                  onClick={(event) => handleLinkClick(link, event)}
                  className={`mobile-nav-link ${linkActive ? "is-active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;