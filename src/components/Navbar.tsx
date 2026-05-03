import { useLang } from "@/contexts/LanguageContext";
import { Globe, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const { lang, toggleLang, t } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/#videos", label: t("الحلقات", "Episodes") },
    { to: "/#places", label: t("الأماكن", "Places") },
    { to: "/stats", label: t("الإحصائيات", "Statistics") },
    { to: "/#team", label: t("الفريق", "Team") },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl rounded-2xl bg-foreground/10 backdrop-blur-xl border border-foreground/15 px-4 md:px-8 py-3"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt={t("حكاية مكان", "Hekayet Makan")}
            className="w-9 h-9 md:w-10 md:h-10 object-contain"
          />
          <span className="text-foreground text-base md:text-lg font-bold font-cairo">
            {t("حكاية مكان", "Hekayet Makan")}
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-xs lg:text-sm text-foreground/70">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-foreground transition-colors duration-300">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-foreground/70 hover:text-foreground transition-colors duration-300 text-sm"
          >
            <Globe className="w-4 h-4" />
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <Link
            to="/#team"
            className="hidden md:inline-flex items-center px-5 py-2 rounded-full border border-foreground/30 text-foreground text-sm hover:bg-foreground/10 transition-all duration-300"
          >
            {t("تواصل معنا", "Contact Us")}
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="sm:hidden text-foreground/80 hover:text-foreground p-1.5 rounded-lg hover:bg-foreground/10 transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 pt-3 pb-1 mt-3 border-t border-foreground/10">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-colors font-cairo"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/#team"
                onClick={() => setOpen(false)}
                className="mt-2 text-center px-4 py-2.5 rounded-lg border border-foreground/30 text-foreground text-sm hover:bg-foreground/10 transition-all font-cairo"
              >
                {t("تواصل معنا", "Contact Us")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
